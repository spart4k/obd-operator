const currec = [];
const list = []; //список значений основных полей справочника id name color
const previous = [];
const dataTable = [];
const any = [];

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js')
//     .then(() => navigator.serviceWorker.ready.then((worker) => {
//       worker.sync.register('syncdata');
//     }))
//     .catch((err) => console.log(err));
// } else {
//   console.log('Your browser doesn\'t support web workers.');
// }

$(window).ready(function () {
  $('[data-toload]').appear();//use for appear
  $.force_appear();           //use for appear


  //unlogin
  waitForElm('#logout-link').then((el) => {
    $('#logout-link').on('click', function (e) {
      e.preventDefault();
      $.post('/common/logout', {}, function (result) {
        clearDataTable();
        sessionStorage.clear();
        window.location.replace("/login");
      });
    });
  });


  //tabs to accordion
  // $(document).ready(function(){
  //   // Add minus icon for collapse element which is open by default
  //   $(".collapse.show").each(function(){
  //       $(this).prev(".card-header").find(".fa").addClass("fa-minus").removeClass("fa-plus");
  //   });

  //   // Toggle plus minus icon on show hide of collapse element
  //   $(".collapse").on('show.bs.collapse', function(){
  //       $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
  //   }).on('hide.bs.collapse', function(){
  //       $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
  //   });
  // });
  //

});

forceAppear('body *');//use for appear

function navOnclick(el) {
  $('.nav-link').removeClass('active');
  $(el).addClass('active');
  $('#tmp').remove();

  $('#content').html('');
  loadContent(el.href, '#content', true, '', false);
  $('#content').removeClass('hidden');

  $('.navbar-collapse').collapse('hide');
  clearDataTable();
}

function clearDataTable(alias = null) {
  if (alias === null) {
    //clear all table and form
    for (var member in dataTable) {
      delete dataTable[member];
    }

  } else {
    delete dataTable[alias];
  }
}

$(document).on('click', 'body *', function () {
  $('.navbar-collapse').collapse('hide');
});


async function getDataDBAsync(url) {
  const get = await fetch("/view/json/" + url);
  const data = await get.json();
  return data;
}

async function getDataAnyAsync(url) {
  const get = await fetch(url);
  const data = await get.json();
  return data;
}


const save2List = (dataToSave, alias) => {
  sessionStorage.removeItem(alias);
  list[alias] = [];
  list[alias] = dataToSave;
  //sessionStorage.setItem(alias, JSON.stringify(dataToSave));
}

function getDataLocal(url) {
  const alias = url.split('?')[0].split('&')[0];  //remove filter param
  switch (true) {
    case !empty(list[alias]):
      //   console.log('getFrom list', alias);
      break;
    case !empty(sessionStorage.getItem(alias)):
      //   console.log('getFrom Storage', alias);
      list[alias] = getObjFromJson(sessionStorage.getItem(alias));
      break;
  }
  return list[alias] || null;
}

function getDataCustom(url, alias, forceDromDB = false, callBack = null, ...args) {
  const dataLoc = getDataLocal(alias);
  if (forceDromDB || empty(dataLoc)) {
    getDataAnyAsync(url).then((data) => {
      save2List(data, alias);//todo: ???
      if (!empty(callBack)) callBack(data, ...args);
    });
  } else {
    if (!empty(callBack)) callBack(dataLoc, ...args)
  }
}

function getData(url, forceDromDB = false, callBack = null, ...args) {
  const alias = url.split('?')[0].split('&')[0];       //remove filter param
  const dataLoc = getDataLocal(alias);
  if (forceDromDB || empty(dataLoc)) {
    getDataDBAsync(url).then((data) => {
      save2List(data, alias);//todo: ???
      if (!empty(callBack)) callBack(data, ...args);
    });
  } else {
    if (!empty(callBack)) callBack(dataLoc, ...args)
  }
}

function initSelect(id, init_param = null) {
  console.log($('#' + id))
  const $el = $('#' + id);
  const init_param_def = {
    placeholder_text_single: "Выберите",
    no_results_text: "Не найдено!"
  };

  if (empty(init_param)) {
    $el.chosen(init_param_def);
  } else {
    //todo merge init_param_def + init_param
    $el.chosen(eval('({' + init_param + '})'));
  }

  $el.change(function () {
    if ($el.hasAttr('multiple')) {
      $(this).data('val', $(this).val().map(parseFloat));//мультиселекту массив. у обычного селекта селекта не должно быть data-val !!
    }
  });

  // $el.next().find('span').addClass('spinner-border spinner-border-sm mt-1 text-secondary');
  return $el;
}

const fillItems = (arr, arr_selected, id, permissionSelect = false, costyl = false) => {

  //заполнение   chosen- селектов

  if (empty(arr) && !costyl) return;
  const $el = $('#' + id);
  let selectList = document.getElementById(id);

  $el.empty();

  if (!empty(arr_selected)) {
    if (typeof (arr_selected) === 'string' || typeof (arr_selected) === 'number') arr_selected = valToArrInt(arr_selected);
    if ($el.hasAttr('data-val')) $el.data('val', arr_selected);
  }

  async function fill() {

    selectList.appendChild(document.createElement("option")); //for placholder

    arr.forEach(function (item, i, arr) {
      var option = document.createElement("option");

      option.value = item.id;
      option.text = item.name;

      if (Object.keys(item).length > 2) {
        for (var key in item) {
          if (key !== "id" || key !== "name") {
            if (key != 'disabled') {
              option.setAttribute(key, item[key])
            }
          }
        }
      }

      if (arr.length === 1) {
        option.selected = true;   //если одно значение выбор по умолчанию
        // $('#' + id + '_div').addClass('hidden'); //скрывть див
        //  } else {
        //$('#' + id + '_div').removeClass('hidden'); //скрывть див
      }

      if (!empty(item.permission_select_json) && permissionSelect === false) {

        if ($.inArray(PERMISSIONS, valToArrInt(item.permission_select_json)) === -1) option.disabled = true

      }

      if (!empty(item.disabled) && item.disable == 1) option.disabled = true; //attrib += ' disabled';
      if (!empty(item.color)) option.style = "background-color:" + item.color;  //attrib += ' style="background-color:' + item.color + '" ';
      if ($.inArray(item.id, arr_selected) > -1) option.selected = true;
      try {
        if (arr_selected.indexOf(item.id) > 0) option.selected = true;
      }
      catch (e) { }

      selectList.appendChild(option);
    });
  }
  fill().then(() => { $el.trigger("chosen:updated"); })
}

$.fn.hasAttr = function (name) {
  return this.attr(name) !== undefined;
};

$.fn.tagName = function () {
  return this.prop("tagName");
};

function valToArrInt(val) {
  let res = [];
  try {
    res = JSON.parse(val).map(parseFloat);
  } catch (e) {
    try {
      res = val.split(',').map(parseFloat);
    } catch (e) {
      try {
        res = val.map(parseFloat);
      } catch (e) {
        res.push(Number(val));//одиночное значение отдаем как эл. массива
      }
    }

  }
  return res;
}

function empty(val) {
  // test results
  //---------------
  // []        true, empty array
  // {}        true, empty object
  // null      true
  // undefined true
  // ""        true, empty string
  // ''        true, empty string
  // 0         false, number
  // true      false, boolean
  // false     false, boolean
  // Date      false
  // function  false

  if (val === undefined)
    return true;
  if (typeof (val) == 'function' || typeof (val) == 'number' || typeof (val) == 'boolean' || Object.prototype.toString.call(val) === '[object Date]')
    return false;
  if (val == null || val.length === 0)        // null or 0 length array
    return true;

  if (typeof (val) == "object") {
    // empty object
    var r = true;
    for (var f in val)
      r = false;
    return r;
  }
  return false;
}

function getURLVar(key) {
  var value = [];
  var query = String(document.location).split('?');

  if (query[1]) {
    var part = query[1].split('&');

    for (i = 0; i < part.length; i++) {
      var data = part[i].split('=');

      if (data[0] && data[1]) {
        value[data[0]] = data[1];
      }
    }

    if (value[key]) {
      return value[key];
    } else {
      return '';
    }
  }
}

function getTodayDate() {
  var tdate = new Date();
  var dd = tdate.getDate(); //yields day
  var MM = tdate.getMonth(); //yields month
  var yyyy = tdate.getFullYear(); //yields year
  var currentDate = dd + "-" + (MM + 1) + "-" + yyyy;
  return currentDate;
}

function capittalize(s) {
  return s.split(/\s+/).map(word => word[0].toString().toUpperCase() + word.substring(1).toLowerCase()).join(' ');
}
function limitInput(k, obj) {
  switch (k) {
    case 'ru':
      obj.value = obj.value.replace(/[^а-яА-ЯёЁ -]/ig, '');
      break;
    case 'en':
      obj.value = obj.value.replace(/[^a-zA-Z0-9 -]/ig, '');
      break;
  }
}
function back() {

  const url = sessionStorage.getItem('previousUrl');

  if ($('#tmp').length) {

    history.pushState(null, null, url);//no page update

  } else {

    if (url !== null) {
      document.location.href = url;
    } else {
      document.location.href = '/';
    }


  }
  unlockBtn();
  $('#content').removeClass('hidden');
  $('#tmp').remove();

}

function loadContent(url, el = '#content', setpushState = true, urlCondition = '', useTmp = true, alias = '') {
  console.log(url)
  urlCondition = urlCondition || '';
  //if (url.indexOf('&h') === -1) url +=  url.indexOf('?') === -1  ?  '?h' + urlCondition  :  '&h' + urlCondition ;

  const url_ = new URL(window.location.origin + url)
  if (url_.search === '') { url += '?h' } else { url += '&h' }
  url += urlCondition;
  console.log(url)
  // console.log('loadContent URL', url);
  //если флаг утсновить предыдущий урл и такой урл еще не установлен то присваеваме
  if (setpushState) {
    sessionStorage.setItem('previousUrl', window.location.pathname + window.location.search + window.location.hash);
    if (useTmp) {
      previous['elem'] = el;
      $(el).addClass('hidden');
      if (!$('#tmp').length) $(el).after('<div id="tmp"></div>');
      el = '#tmp';
    }
  }


  $(el).load(url, function (response, status, xhr) {

    if (setpushState) {
      history.pushState(null, null, url.replace("?h", "").replace("&h", "").replace("/form", "/wrap_form"));
    }

    $('[data-toload]').appear();
    forceAppear(el);
  });
  return false;
}

function loadContentToTabOld(el, viewType, сondition, сonditionValue, setpushState = true) {
  //todo сделать циклом по вкладкам по атрибуту из тега а убрать title-wrapper hidden и сondition сделать массивом и сохранять для возможности фильтрации
  if (empty(сonditionValue)) {
    slidePopup('Нужно сохранить основную форму!');
    $(el).removeClass('active');
    return false;
  }

  const nameTab = $(el).attr('aria-controls').toString().replace('tab_', '');

  if ($("#tab_" + nameTab).children().length === 0) {
    if (viewType === 'table') clearDataTable(nameTab);
    console.log('/view/' + viewType + '/' + nameTab)
    loadContent('/view/' + viewType + '/' + nameTab, '#tab_' + nameTab, false, сondition + сonditionValue)
  }

  if (setpushState) location.hash = '#' + nameTab;

}

/*---ПЕРЕДЕЛЫВАНИЕ ЗАГРУЗКИ ДАННЫХ ВО ВКЛАДКИ---*/
function loadContentToTab(el, viewType, сondition, setpushState = true) {

  //todo сделать циклом по вкладкам по атрибуту из тега а убрать title-wrapper hidden и сondition сделать массивом
  console.log('viewType', viewType);
  console.log('сondition', сondition);

  сondition.match(/\{(.+)\}/g).forEach((id) => {
    const elId = id;
    const elV = $('#' + id.replace('{', '').replace('}', '')).val();
    сondition = сondition.replace(elId, elV);
  });

  const nameTab = $(el).attr('aria-controls').toString().replace('tab_', '');

  let url = '/view/' + viewType + '/' + nameTab;
  if (viewType == 'controllerobject' || viewType == 'habitation') {
    url = '/' + viewType + '/' + nameTab;
  }

  if ($("#tab_" + nameTab).children().length === 0) {
    if (viewType === 'table') clearDataTable(nameTab);
    loadContent(url, '#tab_' + nameTab, false, сondition)
  }

  if (setpushState) location.hash = '#' + nameTab;

}

function setLocation(curLoc) {
  try {
    history.pushState(null, null, curLoc);
    return;
  } catch (e) { }
  location.hash = '#' + curLoc;
}

function forceAppear(el = '#content') {
  console.log(el)
  if ($(el).hasClass('loaded')) return false;

  $.force_appear();
  //$('[data-toload]').appear();

  $(el).on('appear', '[data-toload]', function (e, $affected) {
    console.log('jopa gorillyu')
    $affected.each(function () {

      if ($(this).is(':appeared') && $(this).hasClass('loaded') === false) {
        console.log('jopa gorillyu2')
        const param = eval('({' + $(this).data('toload').toString() + '})'); //строку в обьeкт;

        if (param['clear'] === true) {
          $(this).empty();
        }

        loadTemplate($(this), param);
        $(this).addClass('loaded');
        console.log('jopa gorillyu3')
      }

    })

  });
}

function loadTemplate(el, param) {
  if ($(el).hasClass('loaded')) return false;

  if (empty(param.jsonDataUrl)) {
    $(el).loadTemplate("/html/" + param.tpl + ".html" + DEBUG, param,
      {
        append: param.append,
        to: param.to,
        complete: function () {
          if (!empty(param.url)) {
            if (!empty(param.toid)) {
              loadContent(param.url, '#' + param.toid, false);  //в id
            } else {
              loadContent(param.url, '.' + param.to, false); //в класс
            }
          }
        }
      })
  } else {
    // console.log('param.jsonDataUrl',param.jsonDataUrl);
    fetch(param.jsonDataUrl).then((data) => {
      $(el).loadTemplate("/html/" + param.tpl + ".html" + DEBUG, data, {
        append: param.append
      });
    })
  }
}

function openPopup(url, el, className = 'modal-dialog modal-dialog-centered modal-fullscreen-sm-down modal-md') {

  lockBtn(el);
  let lz = '';
  if ($('#modal').length > 0) {
    lz = '2';
  }

  $("#modal_wrapper" + lz).loadTemplate('/html/modal_form' + lz + '.html' + DEBUG,
    { className: className },
    {
      append: false,
      clear: true,
      complete: function () {
        $('#modal' + lz).modal('show');

        $('#form_modal_content' + lz).load(url, function (response, status, xhr) {
          $('#form_modal_content' + lz + ' .modal-footer').append('<button focusable="false" class="btn btn-secondary btn-sm close-modal" onClick="hideModal(' + lz + ');unlockBtn();return false;"><i class="fas fa-window-close" aria-hidden="true"></i>Закрыть</button>');

          waitForElm('#form_modal_content' + lz).then((elm) => {
            console.log('0-00-1')
            $('[data-toload]').appear();
            forceAppear('#form_modal_content' + lz);
          });
          console.log('0-00-2')
          if (lz !== '') {
            console.log('0-00-3')
            $('.modal-backdrop:last').css('z-index', '1064')
          }
          console.log('0-00-4')
          unlockBtn(el);

        });

      }
    });
  return false;
}


function hideModal(n = '') {

  document.items = []
  document.count_price = 1

  if ($('#modal2').length) {
    n = '2';
  }

  $("#modal" + n).modal('hide');
  $("#modal_wrapper" + n).html('');
  unlockBtn();
}


function toatsQuest(text, textConfirm, icon, func) {
  $div = $('<div/>').appendTo('body');
  $div.addClass("top-50 start-50 translate-middle toast-container position-fixed toats-quest-wrapper");
  $("body").append('<div class="offcanvas-backdrop fade show" style="z-index:9999" id="block-bgr"></div>');
  $div.loadTemplate("/html/toast_quest.html" + DEBUG,
    {
      icon: icon,
      text: text,
      textConfirm: textConfirm
    },
    {
      append: true,
      clear: true,
      complete: function () {
        waitForElm('.toats-quest').then((elm) => {
          toast = new bootstrap.Toast(elm, { autohide: false });
          toast.show();
          $('.toats-quest .confirm').on("click", function () {
            func();
            closeToast();
          });
          $('.toats-quest .dismiss').on("click", function () {
            closeToast()
          });
        });
        function closeToast() {
          toast.dispose();
          $('.toats-quest-wrapper').remove();
          $('#block-bgr').remove();
        }
      }
    });

}

function slidePopup(message, type = 'info', delayms = 4000, url = null) {

  let img = '';

  switch (type) {
    case 'confirm':
      img = 'fas fa-question-circle';
      type = 'dark';
      break;
    case 'success':
      img = 'fas fa-check-circle';
      break;
    case 'error':
      img = 'fas fa-times-circle';
      type = 'danger';
      break;
    case 'danger':
      img = 'fas fa-times-circle';
      break;
    case 'warning':
      img = 'fas fa-exclamation-circle';
      break;
    case 'info':
      img = 'fas fa-info-circle';
      break;
    default:
      img = '';
  }

  $("#toast_wrapper").find('.hide').remove();

  $("#toast_wrapper").loadTemplate("/html/toast.html",
    {
      classNameI: img,
      className: '.bg-gradient bg-' + type,
      classNameA: empty(url) ? "hidden" : 'text-white',
      message: message,
      url: url
    },
    {
      //append: type==='info' || type==='success' ? false : true,  ///todo ?? for remove last error
      //clear: type==='info' || type==='success' ? true : false,
      append: true,
      clear: true,
      complete: function () {
        $('.toast').toast({ delay: delayms });
        $('.toast').toast('show');
      }
    });

}

function saveDB(url, param, async = false) {
  let result = false;
  $.ajax({
    url: url,
    type: 'post',
    cache: false,
    dataType: 'json',
    data: param,
    async: async,
    beforeSend: function () {
      console.log('saveDB', param);
    },
    success: function (data) {
      console.log(data);
      result = data;

    },
    error: function () {
      slidePopup('Неизвестная ошибка!', 'danger');
    }
  });
  unlockBtn();
  return result;
}

async function saveForm($form, table, alias) {
  let data = getFormData($form)
  if (alias === 'user_keys') {
    return;
  }
  if (alias === 'personal_target') {
    if (isNaN(data.personal_id_multiple[0])) {
      console.log('---')
    }
    delete (data.personal_id_multiple);
    data.account_id = ACCOUNT_ID;
  }
  if (alias === 'tmc') {
    alias = document.alias
    data.status = document.tab;
  }
  if (alias === 'personal_target_rashod') {
    data['target_id'] = $('#form_personal_target_id').val();
    data['data_subvision'] = `{"leader": ${$('#form_personal_target_rashod_account_id').val()}, "object": ${$('#form_personal_target_object_id').val()}, "person": ${document.personal_id}}`
    data['region_id'] = getListValueByNameField('object_id', $('#form_personal_target_object_id').val(), 'regions_id')
    data['city_id'] = getListValueByNameField('object_id', $('#form_personal_target_object_id').val(), 'city_id')
    data['type_zayavka'] = 1
    data['responsible'] = $('#form_personal_target_rashod_account_id').val();
    data['direction_id'] = 1;
    data['personal_id'] = document.personal_id;
    data['rek1'] = $('#form_personal_target_rashod_rek_id option:selected').attr('rek1');
    data['rek2'] = $('#form_personal_target_rashod_rek_id option:selected').attr('rek2');
    data['bank_name'] = $('#form_personal_target_rashod_rek_id option:selected').attr('bank_name');
    data.items = JSON.stringify([{
      rashod_vid_id: data.rashod_vid_id,
      count: data.count,
      price: data.price,
      name: data.name,
      is_debit: data.is_debit
    }]);

    $.ajax('/rashod/save_rashod/', {
      method: "POST",
      data: data,
      success: function () {
        dataTable[alias].ajax.reload();
        slidePopup('Сохранено', 'success');
        hideModal();
        unlockBtn();
      }
    });
    return;
  }
  if (alias === 'personal_rashod') {
    data['data_subvision'] = `{"leader": ${document.manager}, "object": ${data['object_id']}, "person": ${document.personal_id}}`
    data['region_id'] = getListValueByNameField('object_id', data['object_id'], 'regions_id')
    data['city_id'] = getListValueByNameField('object_id', data['object_id'], 'city_id')
    data['type_zayavka'] = 1
    data['responsible'] = document.manager;
    data['direction_id'] = document.direction;
    data['personal_id'] = document.personal_id;
    data['rek1'] = $('#form_personal_rashod_rek_id option:selected').attr('rek1');
    data['rek2'] = $('#form_personal_rashod_rek_id option:selected').attr('rek2');
    data['bank_name'] = $('#form_personal_rashod_rek_id option:selected').attr('bank_name');
    data.items = JSON.stringify([{
      rashod_vid_id: data.rashod_vid_id,
      count: data.count,
      price: data.price,
      name: data.name,
      is_debit: data.is_debit
    }]);

    $.ajax('/rashod/save_rashod/', {
      method: "POST",
      data: data,
      success: function () {
        dataTable[alias].ajax.reload();
        slidePopup('Сохранено', 'success');
        hideModal();
        unlockBtn();
      }
    });
    return;
  }
  if (alias === 'payment_rashod') {
    let direction = $('#form_payment_direction_id').val();
    //let bankId = $('#form_payment_rashod_rek_id option[value='+ data.rek_id +']').attr('bank_name');
    data['data_subvision'] = `{"leader": ${$('#form_payment_account_id').val()}, "object": ${$('#form_payment_object_id').val()}, "person": ${$('#form_payment_personal_id').val()}}`
    data['type_zayavka'] = 1
    data['region_id'] = getListValueByNameField('object_id', $('#form_payment_object_id').val(), 'regions_id')
    data['city_id'] = getListValueByNameField('object_id', $('#form_payment_object_id').val(), 'city_id')
    data['responsible'] = $('#form_payment_account_id').val();
    data['personal_id'] = $('#form_payment_personal_id').val();

    data.items = JSON.stringify([{
      rashod_vid_id: data.rashod_vid_id,
      count: data.count,
      price: data.price,
      name: data.name,
      is_debit: data['is_debit']
    }]);
    data['rek1'] = $('#form_payment_rashod_rek_id option:selected').attr('rek1');
    data['rek2'] = $('#form_payment_rashod_rek_id option:selected').attr('rek2');
    data['bank_name'] = $('#form_payment_rashod_rek_id option:selected').attr('bank_name');
    //data.bank_name = bankId;

    $.ajax('/rashod/save_rashod/', {
      method: "POST",
      data: data,
      success: function () {
        dataTable[alias].ajax.reload();
        slidePopup('Сохранено', 'success');
        hideModal();
        unlockBtn();
      }
    });
    return;
    //return
  }
  if (alias === 'zayavka') {
    if (document.toMyself == true) {
      data['data_subvision'] = `{"account": ${ACCOUNT_ID}}`
      data['type_zayavka'] = 4
      data['responsible'] = ACCOUNT_ID
    } else {
      if (document.currentTab == 'person') {
        data['data_subvision'] = `{"leader": ${data['leader_id']}, "object": ${data['object_id']}, "person": ${data['personal_id']}}`
        data['type_zayavka'] = 1
        data['region_id'] = getListValueByNameField('object_id', data['object_id'], 'regions_id')
        data['city_id'] = getListValueByNameField('object_id', data['object_id'], 'city_id')
        data['responsible'] = data['leader_id']
      } else if (document.currentTab == 'object') {
        data['data_subvision'] = `{"type_object": ${data['type_object']}, "object": ${data['object_id']}}`
        data['type_zayavka'] = 2
        if (data['type_object'] == '1') {
          data['region_id'] = getListValueByNameField('object_id', data['object_id'], 'regions_id')
          data['city_id'] = getListValueByNameField('object_id', data['object_id'], 'city_id')
        } else if (data['type_object'] == '2') {
          data['city_id'] = getListValueByNameField('office_all', data['object_id'], 'city_id')
          data['region_id'] = getListValueByNameField('city_id', data['city_id'], 'regions_id')
        } else if (data['type_object'] == '3') {
          let objectId = $(`#form_zayavka_object_id option[value=${data['object_id']}]`).attr('object_id')
          data['region_id'] = getListValueByNameField('object_id', objectId, 'regions_id')
          data['city_id'] = getListValueByNameField('object_id', objectId, 'city_id')
        }
        data['responsible'] = document.owner
      } else if (document.currentTab == 'account') {
        data['data_subvision'] = `{"permission": ${data['post_id']}, "account": ${data['account_id']}}`
        data['type_zayavka'] = 3
        data['responsible'] = data['account_id']
      }
    }

    if (document.isUpdate == false) {
      let items = []
      let containsItem = true
      let count = 1
      let itemPrice = 0
      let itemCount = 0
      while (containsItem) {
        let item = {}
        if (count == 0) {
          item['rashod_vid_id'] = data['rashod_vid_id']
          item['count'] = data['count']
          item['price'] = data['price']
          item['name'] = data['name']
          item['is_debit'] = data['is_debit']
          /* ---- Нужно добавить после изменения таблицы в БД ---- */
          /*delete(data['rashod_vid_id'])
          delete(data['count'])
          delete(data['price'])
          delete(data['name'])*/
        } else {
          itemCount += Number(data['count_' + count])
          itemPrice += Number(data['price_' + count]) * Number(data['count_' + count])

          item['rashod_vid_id'] = data['rashod_vid_id_' + count]
          item['count'] = data['count_' + count]
          item['price'] = data['price_' + count]
          item['name'] = data['name_' + count]
          item['is_debit'] = data['is_debit_' + count]

          /*if (data['is_debit_' + count] == '1') {
            if (document.currentTab == 'person') {
              $.post('/rashod/create_debit', {direction_id: data['direction_id'], object_id: data['object_id'], debtor_id: data['personal_id'], permission_id: 0, responsible_id: data['leader_id'], rashod_vid_id: item['rashod_vid_id'], zayavka_id: 0, sum: item['price']*item['count']})
            } else if (document.currentTab == 'account') {
              $.post('/rashod/create_debit', {direction_id: data['direction_id'], debtor_id: data['account_id'], object_id: -1, permission_id: getListValueByNameField('account_all', data['account_id'], 'permission_id'), responsible_id: getListValueByNameField('account_all', data['account_id'], 'chief_id'), rashod_vid_id: item['rashod_vid_id'], zayavka_id: 0, sum: item['price']*item['count']})
            }
          }*/

          if (data['type_zayavka'] == 3 || data['type_zayavka'] == 4) {
            data['permission_id'] = getListValueByNameField('account_all', data['account_id'], 'permission_id');
            if (data['permission_id'] != 4) {
              data['responsible_id'] = getListValueByNameField('account_all', data['account_id'], 'chief_id');
            } else {
              data['responsible_id'] = data['account_id'];
            }
          }

          delete (data['rashod_vid_id_' + count])
          delete (data['count_' + count])
          delete (data['price_' + count])
          delete (data['name_' + count])
          delete (data['is_debit_' + count])
        }

        items.push(item)
        count++
        if (typeof data['rashod_vid_id_' + count] === 'undefined') {
          containsItem = false
        }
      }

      data.price = itemPrice
      data.count = itemCount
      data.items = JSON.stringify(items)
    } else {
      let index = 0;

      while (typeof data['rashod_vid_id_get_' + index] !== 'undefined') {
        delete (data['rashod_vid_id_get_' + index])
        delete (data['is_debit_' + index])

        index += 1;
      }

      delete (data['rashod_vid_id']);
      delete (data['name']);
      data['items'] = document.data['items'];
      data['count'] = document.data['count'];
      data['price'] = document.data['price'];
      data['responsible'] = document.data['responsible'];
    }

    data['rek1'] = $('#form_zayavka_rek_id option:selected').attr('rek1');
    data['rek2'] = $('#form_zayavka_rek_id option:selected').attr('rek2');
    data['bank_name'] = $('#form_zayavka_rek_id option:selected').attr('bank_name');

    $.ajax('/rashod/save_rashod/', {
      method: "POST",
      data: data,
      success: function () {
        dataTable[alias].ajax.reload();
        slidePopup('Сохранено', 'success');
        hideModal();
        unlockBtn();
      }
    });
    return;
  }

  if (alias === 'objects') {
    let direction = $('#form_objects_direction_id').val();
    let unassigned_directions = ''
    let dateCreate = new Date();
    if (direction == '') {
      direction = `[2, 3]`
      unassigned_directions = `["2", "3"]`
    } else {
      unassigned_directions = `["${direction}"]`
      direction = `[${direction}]`
    }

    data = {
      id: $('#form_objects_id').val() == '' ? null : $('#form_objects_id').val(),
      name: $('#form_objects_name').val() == '' ? $('#form_objects_num_x5').val() : $('#form_objects_name').val(),
      num: $('#form_objects_num_x5').val() == '' ? null : $('#form_objects_num_x5').val(),
      claster_id: null,
      direction_json: direction,
      address: $('#form_objects_address').val(),
      color: $('#form_objects_color_pic').val(),
      tel_director: $('#form_objects_tel_director').val(),
      note: '',
      del: 0,
      //date_create: `${dateCreate.getFullYear()}-${dateCreate.getMonth()}-${dateCreate.getDate()} ${dateCreate.getHours()}:${dateCreate.getMinutes()}:${dateCreate.getSeconds()}`,
      fio_director: $('#form_objects_fio_director').val(),
      square: $('#form_objects_square').val(),
      regions_id: $('#form_objects_regions_id').val(),
      city_id: $('#form_objects_city_id').val(),
      filial: $('#form_objects_filial').val(),
      num_x5: $('#form_objects_num_x5').val(),
      subtype: $('#form_objects_subtype').val(),
      unassigned_direction: unassigned_directions,
      print_form_name: $('#form_objects_print_form_name').val(),
      with_nutrition: $('#form_objects_with_nutrition').val(),
      sum_nutrition: $('#form_objects_sum_nutrition').val(),
    }
  }
  const result = saveDB('/common/save/' + table, data); //сохранение формы
  console.log('saveForm', result);

  if (result.type === "success") {
    if (result.result > 1) {
      currec[alias] = result.result;
    } //при добавлении на новую запись букмарк update возвращает 1
    try {
      dataTable[alias].ajax.reload();
    } catch (err) {
      console.error('Not exist dataTable', alias);
    }
  }

  if (result.type !== "nothing") {
    slidePopup(result.message, result.type);
  }

  hideModal();//для всплывающих форм
  unlockBtn();
}

function validForm($form) {
  //для валидации с числа с точкой
  $.validator.methods.number = function (value, element) {
    return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:[\s\.]\d{3})+)(?:[\.]\d+)?$/.test(value);
  }

  let validator = $form.validate({
    ignore: ":disabled",
    onkeyup: false,
    onclick: false,
    onfocusout: false,
    onsubmit: true,
    submitHandler: function () {
      validator.destroy();
      //сохранили
    },
    errorPlacement: function (error, element) {
      unlockBtn();
      slidePopup($('label[for="' + $(element).attr('id') + '"]').text().replace(':', '') + ' - ' + $(error).text(), 'danger');
    },
    highlight: function (element, errorClass) {
      $(element).addClass('invalid');
      $(element).next("div .chosen-container-multi").find(".chosen-choices").addClass('invalid');
      $(element).next("div .dropzone").addClass('invalid');
      $(element).next("div").children("a").addClass('invalid');
      $(element).next("div").children("a").next("div .chosen-drop").addClass('invalid');
    },
    unhighlight: function (element, errorClass) {
      $(element).next("div .chosen-container-multi").find(".chosen-choices").removeClass('invalid');
      $(element).next("div .dropzone").removeClass('invalid');
      $(element).removeClass('invalid');
      $(element).next(".chosen-single").removeClass('invalid');
    },
    normalizer: function (value) {
      //todo: insert escape function
      return $.trim(value);
    }
  });

  $form.find(':input[name]:enabled, select[name]:enabled').each(function () {
    if (!empty($(this).attr('data-rules'))) {
      let rules = eval('({' + $(this).attr('data-rules') + '})'); //строку в обьeкт
      console.log(this, rules)
      $(this).rules('add', rules);
    }

  });
  //validator.destroy();
  // return validator;
}

function confirmShow(text = '', textConfirm = '', className = '', func) {
  $("#modal_wrapper").loadTemplate("/html/modal_confirm.html",
    { text: text, textConfirm: textConfirm, className: className },
    {
      complete: function () {
        $("#modal").modal('show');
        $('#confirm').on("click", function () {
          func();
          hideModal('');
        });
      }
    });
  return false;
}

function getFormData($form, useNull = true) {
  let formObj = {};
  //берем все елементы в форме т.к. некоторые заблоченные могут содержать значения по умолчанию
  //Таблицы в формах нужно выносить! или удалять списки и инпуты
  $form.find(':input[name]:not(:disabled), select[name]').each(function () {
    if ($(this).attr('name').indexOf('_json') > -1) {

      //для мультиселекта
      if ($(this).hasAttr('data-val') && empty($(this).data('val'))) {

        if (useNull) formObj[$(this).attr('name')] = 'null'; //пусто  чтобы избежать ошибки


      } else if ($(this).hasAttr('data-val')) {

        formObj[$(this).attr('name')] = '[' + $(this).data('val') + ']';

      } else if (!$(this).hasAttr('data-val')) {

        //json textarea
        if (empty($(this).val())) {

          if (useNull) formObj[$(this).attr('name')] = 'null'; //пусто  чтобы избежать ошибки

        } else {

          formObj[$(this).attr('name')] = $(this).val();

        }

      }

    } else if (!empty($(this).data('val')) && $(this).is("select")) { //only select with _json & dataval. textaarea/input maybe has prefix _json

      formObj[$(this).attr('name')] = $(this).data('val');

    } else {  //if(!empty($(this).val()))    - условия чтоб не забирать пустые значения

      //обычные импуты
      if (empty($(this).val())) {

        if (useNull) formObj[$(this).attr('name')] = 'null';

      } else {

        formObj[$(this).attr('name')] = $(this).val();

      }

    }

  });
  return formObj;
}

function deleteSpecialChars(String) {
  return String
    .replace(/\n/g, "")
    .replace(/\r/g, "")
    .replace(/\t/g, "")
    .replace(/\f/g, "")
    .replace('"', '\"')
    .replace("'", "\'")
    .replace(/\\&/g, "\\&")
    .replace(/\t/g, "")
    .replace(/\r?\n/g, "")
    ;

}

function escapeSpecialChars(String) {
  return String
    .replace(/\\/g, '\\')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\f/g, "\\f")
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, "\\&")
    ;

}

function getObjFromJson(str) {

  const data = JSON.parse(deleteSpecialChars(str));
  const param = [];

  $.each(data, function (key, value) {
    switch (true) {
      case key.toString().indexOf('_json', 0) > -1:
        param[key] = JSON.parse(value);
        break;
      case key.toString().indexOf('_b', 0) > -1:
        if (value == 1) {
          param[key] = true;
        } else {
          param[key] = false;
        }
        break;
      default:
        param[key] = value;
    }
  });
  return param;
}

function removeLastComma(strng) {
  var n = strng.lastIndexOf(",");
  var a = strng.substring(0, n)
  return a;
}

function isNumber(num) {
  return typeof num === 'number' && !isNaN(num);
}

function isjQuery(el) {
  res = false;
  if (el instanceof jQuery) {
    res = true;
  }
  return res;
}

function lockBtn(el = null, blockContent = true) {
  if (any['btnLock'] == el) return false; //always lock
  if (blockContent) $("#content").append('<div class="offcanvas-backdrop fade show" style="background-color:#ffffff3d" id="loading-bgr"></div><div class="spinner-border text-primary position-absolute top-50 start-50 wait" style="z-index: 101" id="loading"></div>');
  if (!empty(el)) {
    any['btnLock'] = el;
    if (isjQuery(el)) {
      el = $(el).get(0);
    }
    el.setAttribute('disabled', true);
    $(el).find("i").addClass('hidden');
    $(el).prepend('<span class="spinner-grow spinner-grow-sm my-0 me-1 wait"></span>');
  }

}

function unlockBtn(el = any['btnLock']) {
  //return false;
  if (!empty(el)) {
    if (el instanceof jQuery) {
      el = $(el).get(0);
    }
    el.removeAttribute('disabled');
    $(el).find('.wait').remove();
    $(el).find("i").removeClass('hidden');
  }
  $("#loading").remove();
  $("#loading-bgr").remove();
}

function transliterate(word) {
  var answer = ""
    , a = {};
  a["Ё"] = "YO";
  a["Й"] = "I";
  a["Ц"] = "TS";
  a["У"] = "U";
  a["К"] = "K";
  a["Е"] = "E";
  a["Н"] = "N";
  a["Г"] = "G";
  a["Ш"] = "SH";
  a["Щ"] = "SCH";
  a["З"] = "Z";
  a["Х"] = "H";
  a["Ъ"] = "'";
  a["ё"] = "yo";
  a["й"] = "i";
  a["ц"] = "ts";
  a["у"] = "u";
  a["к"] = "k";
  a["е"] = "e";
  a["н"] = "n";
  a["г"] = "g";
  a["ш"] = "sh";
  a["щ"] = "sch";
  a["з"] = "z";
  a["х"] = "h";
  a["ъ"] = "'";
  a["Ф"] = "F";
  a["Ы"] = "I";
  a["В"] = "V";
  a["А"] = "a";
  a["П"] = "P";
  a["Р"] = "R";
  a["О"] = "O";
  a["Л"] = "L";
  a["Д"] = "D";
  a["Ж"] = "ZH";
  a["Э"] = "E";
  a["ф"] = "f";
  a["ы"] = "i";
  a["в"] = "v";
  a["а"] = "a";
  a["п"] = "p";
  a["р"] = "r";
  a["о"] = "o";
  a["л"] = "l";
  a["д"] = "d";
  a["ж"] = "zh";
  a["э"] = "e";
  a["Я"] = "Ya";
  a["Ч"] = "CH";
  a["С"] = "S";
  a["М"] = "M";
  a["И"] = "I";
  a["Т"] = "T";
  a["Ь"] = "";
  a["Б"] = "B";
  a["Ю"] = "YU";
  a["я"] = "ya";
  a["ч"] = "ch";
  a["с"] = "s";
  a["м"] = "m";
  a["и"] = "i";
  a["т"] = "t";
  a["ь"] = "";
  a["б"] = "b";
  a["ю"] = "yu";
  a[" "] = "_";
  a['"'] = "_";

  for (i in word) {
    if (word.hasOwnProperty(i)) {
      if (a[word[i]] === undefined) {
        answer += word[i];
      } else {
        answer += a[word[i]];
      }
    }
  }
  return answer;
}

function curRow(el) {
  let row
  if ($(el).closest('tr').hasClass('child')) {
    row = $(el).closest('tr').prev()
  } else {
    row = $(el).closest('tr')
  }
  return row;
}

function dtInit(table, param) {

  window.eval('var script_rowCallback = function (row,data){ ' + param.get('tableParam')['script_rowCallback'] + '}');
  window.eval('var script_ajaxComplete = function (){ ' + param.get('tableParam')['script_ajaxComplete'] + '}');
  window.eval('var script_initComplete = function (settings){ ' + param.get('tableParam')['script_initComplete'] + '}');

  const alias = param.get('tableParam')['alias'];
  const urlAdd = empty(param.get('tableParam')['urlAddEdit']) ? '/view/form/' + table : param.get('tableParam')['urlAddEdit'];
  let buttons = [], dom = '', dataUrl = '';

  if (param.get('tableParam')['dataSourceType'] == 1) {
    //параметры таблицы и полей берем только по алиасу:
    dataUrl = '/view/json/' + param.get('tableParam')['alias'];

  } else if (param.get('tableParam')['dataSourceType'] == 2 && empty(param.get('tableParam')['alias'])) {
    dataUrl = param.get('tableParam')['dataUrlAjax']; //url      to ajax
  } else {
    dataUrl = '/view/json/' + param.get('tableParam')['alias'];
  }

  if (!empty(param.get('tableParam')['header_b']) && param.get('tableParam')['header_b'] === true) {
    dom += '<"data_table_header"';
    if (param.get('tableParam')['buttons_b'] === true) {
      dom += 'B';
    }
    if (param.get('tableParam')['search_b'] === true) {
      dom += 'f';
    }
    dom += '>';
  }
  dom += 't<"#dataTables_total">';

  if (!empty(param.get('tableParam')['footer_b']) && param.get('tableParam')['footer_b'] === true) {
    dom += '<"data_table_footer"';
    if (param.get('tableParam')['showInfo_b'] === true) {
      dom += 'i';
    }
    if (param.get('tableParam')['showLentgh_b'] === true) {
      dom += 'l';
    }
    if (param.get('tableParam')['showPage_b'] === true) {
      dom += '<"pagination-sm"p>';
    }
    dom += '>';
  }

  dom += '<"clear">';
  console.log(dom)
  //  buttons block;
  if (!empty(param.get('tableParam')['buttons_b']) && param.get('tableParam')['buttons_b'] === true) {
    if (!empty(param.get('tableParam')['btnUpdate_b']) && param.get('tableParam')['btnUpdate_b'] === true) {
      buttons.push({
        text: '<i class="fas fa-sync-alt"></i>Обновить',
        className: "btn btn-sm",
        attr: {
          id: table + "_update",
        },
        action: function (e, dt, node, config) {
          lockBtn(node);
          dataTable[table].ajax.reload();
        }
      });
    }

    if (!empty(param.get('tableParam')['btnAdd_b']) && param.get('tableParam')['btnAdd_b'] === true && $.inArray(SESSION.get('permissions'), param.get('tableParam')['permission_deladd_json']) > -1) {
      if (param.get('tableParam')['alias'] == 'tmc') {
        buttons.push({
          text: '<i class="fa fa-plus-square"></i>Добавить',
          className: "btn btn-sm",
          attr: {
            id: table + "_add",
          },
          action: function (e, dt, node, config) {
            lockBtn(node);
            switch (param.get('tableParam')['openFormIn']) {
              case 1:
                openPopup('/view/form/tmc' + '?add=1', node, param.get('tableParam')['form_modal_className']);
                break;
              case 2:
                loadContent('/view/form/tmc' + '?add=1', '#content', true);
                break;
              case 3:
                window.open('/view/form/tmc' + '?add=1', '_blank');
                break;
              default:
                break;
            }

          }
        });
      } else {
        buttons.push({
          text: '<i class="fa fa-plus-square"></i>Добавить',
          className: "btn btn-sm",
          attr: {
            id: table + "_add",
          },
          action: function (e, dt, node, config) {
            lockBtn(node);
            switch (param.get('tableParam')['openFormIn']) {
              case 1:
                openPopup(urlAdd + '?add=1', node, param.get('tableParam')['form_modal_className']);
                break;
              case 2:
                loadContent(urlAdd + '?add=1', '#content', true);
                break;
              case 3:
                window.open(urlAdd + '?add=1', '_blank');
                break;
              default:
                break;
            }

          }
        });
      }
    }

    //EXCEL buttons
    if (param.get('tableParam')['btnXls_b'] === true) {
      if (param.get('tableParam')['alias'] == 'zayavka' && PERMISSIONS == 4) {
        buttons.push({
          extend: 'excelHtml5',
          text: '<i class="fas fa-file-excel"></i>Бухгалтерия excel',
          className: "commandButton2 btn btn-sm",
          titleAttr: 'Бухгалтерия Excel',
          filename: 'rashod-' + getTodayDate(),
          title: '',
          header: true,
          exportOptions: {
            columns: [1, 3, 4, 5, 6, 7, 8, 10, 13, 14, 15, 9, 0, 16, 17]
          },
          customizeData: function (data) {
            for (var i = 0; i < data.body.length; i++) {
              data.body[i][1] = moment().format("YYYY-MM-DD");
              data.body[i][9] = '_' + data.body[i][9];
              let who = JSON.parse(data.body[i][4]);
              if (typeof who['person'] != 'undefined') {
                data.body[i][4] = 'Персонаж: ' + getDtNameById('personal_all', who['person']);
              }
              if (typeof who['account'] != 'undefined') {
                data.body[i][4] = 'Аккаунт: ' + getDtNameById('account_all', who['account']);
              }
              if (typeof who['object'] != 'undefined') {
                data.body[i][4] = 'Объект: ' + getDtNameById('object_id', who['object']);
              }
            }
          },
          customize: function (xlsx) {
            if (confirm("Текущим записям присвоится статус 'На оплате', подтверждаете?")) {
              let need = true;
              let count = 0;
              let data = dataTable['zayavka'].data();
              let ids = [];
              while (need) {
                if (typeof data[count] == "undefined") {
                  need = false;
                  break;
                }

                if (data[count].status == 2) {
                  ids.push(data[count].id);
                }

                count++;
              }

              if (ids.length > 0) {
                lockBtn();
                $.post('/common/set_new_status_rashod', { new_status_id: 4, ids: JSON.stringify(ids) }, function (result) {
                  slidePopup("Обработано " + result.count + " записи", result.type);
                  dataTable['zayavka'].ajax.reload();
                });
              }
            }
          }
        });
        buttons.push({
          extend: 'excelHtml5',
          text: '<i class="fas fa-file-excel"></i>Отчет excel',
          className: "commandButton2 btn btn-sm",
          titleAttr: 'Отчет Excel',
          filename: 'rashod_report-' + getTodayDate(),
          title: '',
          header: true,
          exportOptions: {
            columns: [1, 3, 4, 5, 6, 7, 8, 10, 13, 14, 15, 9, 0, 16]
          },
          customizeData: function (data) {
            for (var i = 0; i < data.body.length; i++) {
              data.body[i][1] = moment().format("YYYY-MM-DD");
              data.body[i][9] = '_' + data.body[i][9];
              let who = JSON.parse(data.body[i][4]);
              if (typeof who['person'] != 'undefined') {
                data.body[i][4] = 'Персонаж: ' + getDtNameById('personal_all', who['person']);
              }
              if (typeof who['account'] != 'undefined') {
                data.body[i][4] = 'Аккаунт: ' + getDtNameById('account_all', who['account']);
              }
              if (typeof who['object'] != 'undefined') {
                data.body[i][4] = 'Объект: ' + getDtNameById('object_id', who['object']);
              }
            }
          }
        })
      } else if (param.get('tableParam')['tableName'] == 'personal') {
        buttons.push({
          text: '<i class="fas fa-file-excel"></i>Скачать Excel',
          extend: 'excelHtml5',
          className: "btn btn-sm",
          attr: {
            id: table + "_excel",
          },
          titleAttr: 'Скачать Excel',
          title: '',
          header: true,
          filename: param.get('tableParam')['name'] + '-' + getTodayDate(),
          exportOptions: {
            columns: [2, 4, 9, 10, 11, 12, 13, 14]
          }
        });
      } else {
        buttons.push({
          text: '<i class="fas fa-file-excel"></i>Скачать Excel',
          extend: 'excelHtml5',
          className: "btn btn-sm",
          attr: {
            id: table + "_excel",
          },
          titleAttr: 'Скачать Excel',
          title: '',
          header: true,
          filename: param.get('tableParam')['name'] + '-' + getTodayDate(),
          exportOptions: {
            columns: ':visible'
          }
        })
      }
    }
    console.log(param.get('tableParam')['tableName'])
    //colvis buttons
    if (param.get('tableParam')['btnColvis_b'] === true) {
      buttons.push({
        extend: 'colvis',
        text: '<i class="fas fa-columns"></i>Столбцы',
        className: 'btn btn-sm dropdown-toggle m-0',
      });
    }

    //import
    if (param.get('tableParam')['btnImport_b'] === true) {
      buttons.push({
        text: '<i class="fas fa-upload"></i>Импорт',
        attr: {
          id: table + "_import",
        },
        className: "btn btn-sm btn-upload",
        action: function (e, dt, node, config) {
          //see view/table.php
        }

      });
    }

    // PRINT
    if (param.get('tableParam')['btnPrint_b'] === true) {
      buttons.push({
        extend: 'print',
        className: "btn btn-sm",
        attr: {
          id: table + "_print",
        },
        text: '<i class="fas fa-print"></i>Печать',
        titleAttr: 'Напечатать записи',
        title: '',
        exportOptions: {
          columns: ':visible'
        }
      });
    }

    $.each(param.get('customButtons'), function (i, value) {
      window.eval('var script_buttons = function (e, dt, node, config){ ' + value['script'] + '}');

      buttons.push({
        text: empty(value['icon']) ? value['caption'] : '<i class=\"' + value['icon'] + '\"></i>' + value['caption'],
        className: "btn btn-sm " + value['className'],
        action: script_buttons
      });
    });
  }
  console.log(param.get('columnDefs'))
  console.log('ajax dataUrl', dataUrl)
  console.log('condition', param.get('tableParam')['condition'])
  const dtP = {
    ajax: {
      type: "POST",
      url: dataUrl,
      data: param.get('tableParam')['condition'],
      dataSrc: "",
      beforeSend: function (xhr) {

      },
      data: function (d) {
        try {
          if (table == 'tmc_extradition' || table == 'tmc_storage') {
            let url = '/tmc/';
            if (table == 'tmc_extradition') {
              url += 'get_extradition_list';
            }
            if (table == 'tmc_storage') {
              url += 'get_storage_list';
            }
            url += `?prefilter=1`
            Object.keys(dataTable[table + '_cond']).forEach(name => {
              if (name != 'prefilter') {
                url += `&${name}=${dataTable[table + '_cond'][name]}`;
              }
            })

            dataTable[table + '_cond'].url = url;
          }
          if (table == 'zayavka') {
            if (typeof dataTable['zayavka_cond']['status'] !== 'undefined') {
              dataTable['zayavka_cond']['status'] = JSON.stringify(dataTable['zayavka_cond']['status'])
            }
          }
          console.log($.extend(d, dataTable[table + '_cond']))
          return $.extend(d, dataTable[table + '_cond']);
        } catch {
          return $.extend(d, dataTable[table + '_cond']);
        }
      },
      complete: function () {
        //   $("body").attr("style", "overflow:auto;"); //hook
        unlockBtn();
        dataTable[table].draw();
        if (!empty(param.get('tableParam')['script_ajaxComplete'])) {
          script_ajaxComplete();
        }
      }
    },

    initComplete: function (settings) {
      if (!empty(param.get('tableParam')['script_initComplete'])) script_initComplete();
    },
    //serverSide //todo
    autoWidth: param.get('tableParam')['autoWidth_b'],
    dom: dom,
    fixedHeader: {
      header: false,
      footer: false
    },
    createdRow: function (row, data, dataIndex) {
      // select current row
      $(row).addClass(data.id === currec[table] ? 'table-active' : '');
    },
    fnFooterCallback: function (row, data, start, end, display) {
      //total summ if enable
      if (param.get('tableParam')['showTotal_b']) {
        var intVal = function (i) {
          return typeof i === 'string' ?
            i.replace(/[\$,]/g, '') * 1 :
            typeof i === 'number' ?
              i : 0;
        };

        var api = this.api();
        let total;
        let html = '';
        this.api().columns().every(function (e) {
          var column = this;

          total = api.column(e)
            .data()
            //.text()
            .reduce(function (a, b) {
              return intVal(a) + intVal(b);
            }, 0).toFixed(2);
          if (param.get('columnDefs')[e]['showTotal']) html += '  ' + param.get('columns')[e]['title'] + ': ' + total + ' ';
        });

        $('#dataTables_total').html('<b>Итоги:</b>' + html);
        $('#dataTables_total').addClass("text-center p-1 alert alert-info");
        // var footer = api.table().footer()
        // $(footer)
        //   .empty()
        //   .append(html); //not use
      }


    },

    buttons: buttons,
    // select: {
    //   style: 'multi'
    // },
    select: true,
    columns: param.get('columns'),
    columnDefs: param.get('columnDefs'),
    order: empty(param.get('tableParam')['sortOrder_json']) ? [[0, "DESC"]] : param.get('tableParam')['sortOrder_json'],
    //order: param.get('tableParam')['sortOrder_json'],sortOrder
    //order:[[0, 'ASC']],

    rowCallback: function (row, data) {

      if (!empty(param.get('tableParam')['script_rowCallback'])) {
        script_rowCallback(row, data);
      }
      if (currec[alias] == data.id) {
        $(row).toggleClass('table-active')
      }

    },
    pageLength: param.get('tableParam')['pageLength'],
    /*responsive: true,
    responsive: {
      details: {
        type: 'column',
        target: 'tr'
      }
    },*/
    processing: true,
    "oLanguage": {
      "sLengthMenu": "Записей на странице: _MENU_ ",
      "sZeroRecords": "Ничего не найдено",
      "sInfo": "Показано _START_ до _END_ из _TOTAL_ ",
      "sInfoEmpty": "Нет записей",
      "sInfoFiltered": "(из _MAX_ записей)",
      "sSearch": "Поиск:",
      'sLoadingRecords': '<i class="fas fa-hourglass-half"></i>&nbsp;&nbsp;Подождите...',
      'sProcessing': '<i class="fas fa-hourglass-half"></i>&nbsp;&nbsp;Подождите...',
      'select': {
        //'rows': "Выделено: %d"
        'rows': ""//remove it
      },
      "oPaginate": {
        "sNext": "<i class=\"fas fa-chevron-right\"></i>",
        "sPrevious": "<i class=\"fas fa-chevron-left\"></i>"
      }
    },

  }
  console.log(param)
  //add another param 2 dt
  const s = param.get('tableParam')['dt_param'];
  if (!empty(s)) {
    const j = eval('({' + s + '})');
    $.each(j, function (name, value) {
      dtP[name] = value;
    });
  }
  console.log(dtP);
  return $('#' + table).dataTable(dtP).api();
}

function replace2all(alias) {
  switch (alias) {
    case "direction_id":
    case "doljnost_id":
    case "account_id":
      return alias.replace('_id', '_all');
    default:
      return alias;
  }
}

function getDirectionByAccount(account_id) {
  try {
    return list['account_all'].find(item => item.id == account_id)['direction_json'];
  } catch (err) {
    return account_id;
  }
}

function getListValueByNameField(listName, value, field) {
  try {
    return list[listName].find(item => item.id == value)[field];
  } catch (err) {
    return value;
  }
}

function getDtNameById(alias, data, type, row) {

  try {
    return list[alias].find(item => item.id === data)['name'];
  } catch (err) {
    return data;
  }

}

function getDtColorById(alias, data, type, row) {

  let result;
  if (type === "sort" || type === "type" || type === "display") {
    try {
      result = list[alias].find(item => item.id == data)['color'].toString() + "A0";
    } catch (err) {
      result = '#7d848d21';
    }
  } else {
    result = data;
  }
  return result;
}

function getActiveCols(alias) {
  return (typeof (dataTable[alias]) === 'undefined') ? [] : dataTable[alias].columns().visible().reduce((a, v, i) => v ? [...a, i] : a, [])
}

window.log = (function (console) {
  var canLog = !!console;
  return function (txt) {
    if (canLog) console.log('log: ' + txt);
  };
})(window.console);

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function long2ip(ip) {
  // http://kevin.vanzonneveld.net
  // +   original by: Waldo Malqui Silva
  // *     example 1: long2ip( 3221234342 );
  // *     returns 1: '192.0.34.166'
  if (!isFinite(ip))
    return false;

  return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.');
}

function infoByIP(strIp) {
  console.log('strIp', strIp);
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://ipwhois.app/json/" + strIp,
    "method": "GET"
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
  });
}

function clickBurgDown() {
  let menuL = document.querySelector("#sidebar");
  let logoMenu = document.querySelector("#logo-body");
  let bigMenu = document.querySelector(".navbar-dark");
  let tableBurg = document.querySelector("#content");
  let mainPage = document.querySelector(".main-page");
  let arrowM = document.querySelector("#arrow_menu");
  let lineM = document.querySelector("#line_menu");
  let guidetxt = document.querySelector('.guide-crm')

  mainPage.classList.add('active-burg');
  tableBurg.classList.add('active-burg');
  logoMenu.classList.add('active-burg');
  bigMenu.classList.add('active-burg');
  menuL.classList.add('active-burg');
  console.log(arrowM, '123123');
  arrowM.classList.add("active-burg");
  lineM.classList.add('active-burg');
  guidetxt.classList.add('active-burg');
}



function clickBurgUp() {
  let menuL = document.querySelector("#sidebar");
  let logoMenu = document.querySelector("#logo-body");
  let bigMenu = document.querySelector(".navbar-dark");
  let tableBurg = document.querySelector("#content");
  let mainPage = document.querySelector(".main-page");
  let arrowM = document.querySelector("#arrow_menu");
  let lineM = document.querySelector("#line_menu");
  let guidetxt = document.querySelector('.guide-crm')

  mainPage.classList.remove('active-burg');
  tableBurg.classList.remove('active-burg');
  logoMenu.classList.remove('active-burg');
  bigMenu.classList.remove('active-burg');
  menuL.classList.remove('active-burg');
  arrowM.classList.remove('active-burg');
  lineM.classList.remove('active-burg');
  guidetxt.classList.remove('active-burg');
};

function clickMenuSwipe(el) {
  // $("text_menu_slide").attr("aria-expanded","false");
  // $(this).attr("aria-expanded","true")
  $('.nav-link').removeClass('active');
  $('.sidebar-link').attr('aria-expanded', 'false');
  $(el).attr('aria-expanded', 'true');

  $('.collapse').collapse('hide');



}

function guidePopup() {
  //$('#conteiner_guide').html('');
  $('.body-guide').toggleClass('open-guide');
  $('#logo-body').toggleClass('shadow-logo-body');

  $('#conteiner_guide').dxTreeList({
    dataSource: employees,
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    showRowLines: true,
    showBorders: true,
    columnAutoWidth: true,
    selection: {
      mode: 'single',
    },
    columns: [{
      dataField: 'Full_Name',
      caption: 'Справочник',
    },
    ],
    expandedRowKeys: [1],

  });
}

// справочник

var employees = [{
  ID: 1,
  Head_ID: 0,
  Full_Name: 'М-бизнес',
  Prefix: 'Mr.',
  Title: 'CEO',
  City: 'Los Angeles',
  State: 'California',
  Email: 'jheart@dx-email.com',
  Skype: 'jheart_DX_skype',
  Mobile_Phone: '(213) 555-9392',
  Birth_Date: '1964-03-16',
  Hire_Date: '1995-01-15',
}, {
  ID: 2,
  Head_ID: 1,
  Full_Name: 'IT',
}, {
  ID: 3,
  Head_ID: 1,
  Full_Name: 'ДБА',
}, {
  ID: 4,
  Head_ID: 1,
  Full_Name: 'Менджеры',
}, {
  ID: 5,
  Head_ID: 1,
  Full_Name: 'Отдел безопасности',
}, {
  ID: 6,
  Head_ID: 3,
  Full_Name: 'Brett Wade',
  Prefix: 'Mr.',
  Title: 'IT Manager',
  City: 'Reno',
  State: 'Nevada',
  Email: 'brettw@dx-email.com',
  Skype: 'brettw_DX_skype',
  Mobile_Phone: '(626) 555-0358',
  Birth_Date: '1968-12-01',
  Hire_Date: '2009-03-06',
}, {
  ID: 7,
  Head_ID: 5,
  Full_Name: 'Sandra Johnson',
  Prefix: 'Mrs.',
  Title: 'Controller',
  City: 'Beaver',
  State: 'Utah',
  Email: 'sandraj@dx-email.com',
  Skype: 'sandraj_DX_skype',
  Mobile_Phone: '(562) 555-2082',
  Birth_Date: '1974-11-15',
  Hire_Date: '2005-05-11',
}, {
  ID: 8,
  Head_ID: 4,
  Full_Name: 'Ed Holmes',
  Prefix: 'Dr.',
  Title: 'Sales Manager',
  City: 'Malibu',
  State: 'California',
  Email: 'edwardh@dx-email.com',
  Skype: 'edwardh_DX_skype',
  Mobile_Phone: '(310) 555-1288',
  Birth_Date: '1973-07-14',
  Hire_Date: '2005-06-19',
}, {
  ID: 9,
  Head_ID: 3,
  Full_Name: 'Barb Banks',
  Prefix: 'Mrs.',
  Title: 'Support Manager',
  City: 'Phoenix',
  State: 'Arizona',
  Email: 'barbarab@dx-email.com',
  Skype: 'barbarab_DX_skype',
  Mobile_Phone: '(310) 555-3355',
  Birth_Date: '1979-04-14',
  Hire_Date: '2002-08-07',
}, {
  ID: 10,
  Head_ID: 2,
  Full_Name: 'Азаров Михаил',
  Prefix: 'Mr.',
  Title: 'Shipping Manager',
  City: 'San Diego',
  State: 'California',
  Email: 'kevinc@dx-email.com',
  Skype: 'kevinc_DX_skype',
  Mobile_Phone: '(213) 555-2840',
  Birth_Date: '1978-01-09',
  Hire_Date: '2009-08-11',
}, {
  ID: 11,
  Head_ID: 5,
  Full_Name: 'Cindy Stanwick',
  Prefix: 'Ms.',
  Title: 'HR Assistant',
  City: 'Little Rock',
  State: 'Arkansas',
  Email: 'cindys@dx-email.com',
  Skype: 'cindys_DX_skype',
  Mobile_Phone: '(818) 555-6655',
  Birth_Date: '1985-06-05',
  Hire_Date: '2008-03-24',
}, {
  ID: 12,
  Head_ID: 8,
  Full_Name: 'Sammy Hill',
  Prefix: 'Mr.',
  Title: 'Sales Assistant',
  City: 'Pasadena',
  State: 'California',
  Email: 'sammyh@dx-email.com',
  Skype: 'sammyh_DX_skype',
  Mobile_Phone: '(626) 555-7292',
  Birth_Date: '1984-02-17',
  Hire_Date: '2012-02-01',
}, {
  ID: 13,
  Head_ID: 10,
  Full_Name: 'Павлов Иван',
  Prefix: 'Mr.',
  Title: 'Shipping Assistant',
  City: 'Pasadena',
  State: 'California',
  Email: 'davidj@dx-email.com',
  Skype: 'davidj_DX_skype',
  Mobile_Phone: '(626) 555-0281',
  Birth_Date: '1983-03-06',
  Hire_Date: '2011-04-24',
}, {
  ID: 14,
  Head_ID: 10,
  Full_Name: 'Шмельков Максим',
  Prefix: 'Mr.',
  Title: 'Shipping Assistant',
  City: 'Little Rock',
  State: 'Arkansas',
  Email: 'victorn@dx-email.com',
  Skype: 'victorn_DX_skype',
  Mobile_Phone: '(213) 555-9278',
  Birth_Date: '1986-07-23',
  Hire_Date: '2012-07-23',
}, {
  ID: 15,
  Head_ID: 10,
  Full_Name: 'Алина',
  Prefix: 'Ms.',
  Title: 'Shipping Assistant',
  City: 'Beaver',
  State: 'Utah',
  Email: 'marys@dx-email.com',
  Skype: 'marys_DX_skype',
  Mobile_Phone: '(818) 555-7857',
  Birth_Date: '1982-04-08',
  Hire_Date: '2012-08-12',
}, {
  ID: 16,
  Head_ID: 10,
  Full_Name: 'Женек',
  Prefix: 'Mrs.',
  Title: 'Shipping Assistant',
  City: 'Los Angeles',
  State: 'California',
  Email: 'robinc@dx-email.com',
  Skype: 'robinc_DX_skype',
  Mobile_Phone: '(818) 555-0942',
  Birth_Date: '1981-06-12',
  Hire_Date: '2012-09-01',
}, {
  ID: 17,
  Head_ID: 9,
  Full_Name: 'Kelly Rodriguez',
  Prefix: 'Ms.',
  Title: 'Support Assistant',
  City: 'Boise',
  State: 'Idaho',
  Email: 'kellyr@dx-email.com',
  Skype: 'kellyr_DX_skype',
  Mobile_Phone: '(818) 555-9248',
  Birth_Date: '1988-05-11',
  Hire_Date: '2012-10-13',
}, {
  ID: 18,
  Head_ID: 9,
  Full_Name: 'James Anderson',
  Prefix: 'Mr.',
  Title: 'Support Assistant',
  City: 'Atlanta',
  State: 'Georgia',
  Email: 'jamesa@dx-email.com',
  Skype: 'jamesa_DX_skype',
  Mobile_Phone: '(323) 555-4702',
  Birth_Date: '1987-01-29',
  Hire_Date: '2012-10-18',
}, {
  ID: 19,
  Head_ID: 9,
  Full_Name: 'Antony Remmen',
  Prefix: 'Mr.',
  Title: 'Support Assistant',
  City: 'Boise',
  State: 'Idaho',
  Email: 'anthonyr@dx-email.com',
  Skype: 'anthonyr_DX_skype',
  Mobile_Phone: '(310) 555-6625',
  Birth_Date: '1986-02-19',
  Hire_Date: '2013-01-19',
}, {
  ID: 20,
  Head_ID: 8,
  Full_Name: 'Olivia Peyton',
  Prefix: 'Mrs.',
  Title: 'Sales Assistant',
  City: 'Atlanta',
  State: 'Georgia',
  Email: 'oliviap@dx-email.com',
  Skype: 'oliviap_DX_skype',
  Mobile_Phone: '(310) 555-2728',
  Birth_Date: '1981-06-03',
  Hire_Date: '2012-05-14',
}, {
  ID: 21,
  Head_ID: 6,
  Full_Name: 'Taylor Riley',
  Prefix: 'Mr.',
  Title: 'Network Admin',
  City: 'San Jose',
  State: 'California',
  Email: 'taylorr@dx-email.com',
  Skype: 'taylorr_DX_skype',
  Mobile_Phone: '(310) 555-7276',
  Birth_Date: '1982-08-14',
  Hire_Date: '2012-04-14',
}, {
  ID: 22,
  Head_ID: 6,
  Full_Name: 'Amelia Harper',
  Prefix: 'Mrs.',
  Title: 'Network Admin',
  City: 'Los Angeles',
  State: 'California',
  Email: 'ameliah@dx-email.com',
  Skype: 'ameliah_DX_skype',
  Mobile_Phone: '(213) 555-4276',
  Birth_Date: '1983-11-19',
  Hire_Date: '2011-02-10',
}, {
  ID: 23,
  Head_ID: 6,
  Full_Name: 'Wally Hobbs',
  Prefix: 'Mr.',
  Title: 'Programmer',
  City: 'Chatsworth',
  State: 'California',
  Email: 'wallyh@dx-email.com',
  Skype: 'wallyh_DX_skype',
  Mobile_Phone: '(818) 555-8872',
  Birth_Date: '1984-12-24',
  Hire_Date: '2011-02-17',
}, {
  ID: 24,
  Head_ID: 6,
  Full_Name: 'Brad Jameson',
  Prefix: 'Mr.',
  Title: 'Programmer',
  City: 'San Fernando',
  State: 'California',
  Email: 'bradleyj@dx-email.com',
  Skype: 'bradleyj_DX_skype',
  Mobile_Phone: '(818) 555-4646',
  Birth_Date: '1988-10-12',
  Hire_Date: '2011-03-02',
}, {
  ID: 25,
  Head_ID: 6,
  Full_Name: 'Karen Goodson',
  Prefix: 'Miss',
  Title: 'Programmer',
  City: 'South Pasadena',
  State: 'California',
  Email: 'kareng@dx-email.com',
  Skype: 'kareng_DX_skype',
  Mobile_Phone: '(626) 555-0908',
  Birth_Date: '1987-04-26',
  Hire_Date: '2011-03-14',
}, {
  ID: 26,
  Head_ID: 5,
  Full_Name: 'Marcus Orbison',
  Prefix: 'Mr.',
  Title: 'Travel Coordinator',
  City: 'Los Angeles',
  State: 'California',
  Email: 'marcuso@dx-email.com',
  Skype: 'marcuso_DX_skype',
  Mobile_Phone: '(213) 555-7098',
  Birth_Date: '1982-03-02',
  Hire_Date: '2005-05-19',
}, {
  ID: 27,
  Head_ID: 5,
  Full_Name: 'Sandy Bright',
  Prefix: 'Ms.',
  Title: 'Benefits Coordinator',
  City: 'Denver',
  State: 'Colorado',
  Email: 'sandrab@dx-email.com',
  Skype: 'sandrab_DX_skype',
  Mobile_Phone: '(818) 555-0524',
  Birth_Date: '1983-09-11',
  Hire_Date: '2005-06-04',
}, {
  ID: 28,
  Head_ID: 6,
  Full_Name: 'Morgan Kennedy',
  Prefix: 'Mrs.',
  Title: 'Graphic Designer',
  City: 'San Fernando Valley',
  State: 'California',
  Email: 'morgank@dx-email.com',
  Skype: 'morgank_DX_skype',
  Mobile_Phone: '(818) 555-8238',
  Birth_Date: '1984-07-17',
  Hire_Date: '2012-01-11',
}, {
  ID: 29,
  Head_ID: 28,
  Full_Name: 'Violet Bailey',
  Prefix: 'Ms.',
  Title: 'Jr Graphic Designer',
  City: 'La Canada',
  State: 'California',
  Email: 'violetb@dx-email.com',
  Skype: 'violetb_DX_skype',
  Mobile_Phone: '(818) 555-2478',
  Birth_Date: '1985-06-10',
  Hire_Date: '2012-01-19',
}, {
  ID: 30,
  Head_ID: 5,
  Full_Name: 'Ken Samuelson',
  Prefix: 'Dr.',
  Title: 'Ombudsman',
  City: 'St. Louis',
  State: 'Missouri',
  Email: 'kents@dx-email.com',
  Skype: 'kents_DX_skype',
  Mobile_Phone: '(562) 555-9282',
  Birth_Date: '1972-09-11',
  Hire_Date: '2009-04-22',
}];








/*add glare effect to element*/
function glare($el) {
  setTimeout(() => {
    $($el).addClass('btn-glare');
    $($el).focus();
    setTimeout(() => { $($el).removeClass('btn-glare'); }, 2000);
  }, 2000);
}

function waitForElm(selector) {
  //https://translated.turbopages.org/proxy_u/en-ru.ru.7736b99c-6256cd4b-93f07a9c-74722d776562/https/stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// Функция для открытия изображения на весь экран

function openImage(src) {
  const modalImage = document.querySelector('.modal-image')
  const modalImageBody = modalImage.querySelector('.modal-image-body')
  const closeBtn = modalImage.querySelector('.modal-image-body__close')
  const image = document.getElementById('img-full-screen')
  if (modalImage) {
    if (image) {
      setImage(src)
      showPopupImage()
      closeBtn.addEventListener('click', () => closePopupImage())
      document.addEventListener('keydown', event => keydownEscape(event))
      modalImage.addEventListener('click', event => outsideClick(event))
    }
  }
  function setImage(src) {
    image.src = src
  }
  function showPopupImage() {
    modalImage.classList.add('open-popup-image')
  }
  function closePopupImage() {
    modalImage.classList.remove('open-popup-image')
    closeBtn.removeEventListener('click', closePopupImage)
    document.removeEventListener('keydown', keydownEscape)
  }
  function keydownEscape(event) {
    if (event.key === 'Escape') closePopupImage()
  }
  function outsideClick(event) {
    if (!image.contains(event.target)) {
      closePopupImage()
    }
  }
}

function openImageSlider(options, indexSlide, carousel) {
  console.log(carousel)
  const modalImage = document.querySelector('.modal-image-slider')
  const closeBtn = modalImage.querySelector('.modal-image-slider-body__close')
  const image = document.getElementById('img-full-screen')
  console.log(modalImage)
  if (modalImage) {
    showPopupImage()
    closeBtn.addEventListener('click', () => closePopupImage())
    document.addEventListener('keydown', event => keydownEscape(event))
  }
  function showPopupImage() {
    console.log(modalImage)
    modalImage.classList.add('open-popup-image')
  }
  function closePopupImage() {
    modalImage.classList.remove('open-popup-image')
    closeBtn.removeEventListener('click', closePopupImage)
    document.removeEventListener('keydown', keydownEscape)
  }
  function keydownEscape(event) {
    if (event.key === 'Escape') closePopupImage()
  }
  function initSlider() {
    console.log(carousel)
    const galleryWidget = $(carousel).dxGallery(options).dxGallery('instance');
    console.log(indexSlide)
    setTimeout(() => {
      galleryWidget.goToItem(indexSlide)
    }, 300)
  }
  initSlider()
}





