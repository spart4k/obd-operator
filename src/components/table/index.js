
import choosenSelect from "../choosenSelect/index.js"
const table = {
  components: {
    choosenSelect,
    vue2Dropzone: window['vue2Dropzone'],
    DatePicker: window['DatePicker'],
  },
  props: {
    rows: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    removeField(item, index) {
      console.log(item, index)
      this.$emit('remove-field', item, index)
    },
    addField() {
      this.$emit('add-field')
    }
  },
  mounted() {
    console.log(vue2Dropzone)
  },
  template: `
  <div>
    <div class="addTable">
      <div class="list">
        <div class="addTable-header">
          <div class="field">
            Объект
          </div>
          <div class="field">
            Смена
          </div>
          <div class="field">
            Должность
          </div>
          <div class="field">
            Дата
          </div>
        </div>
        <transition-group name="testanim">
          <div v-for="(item, index) in rows" :key="item.id" class="row">
            <!--<svg  enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M20.377,16.519l6.567-6.566c0.962-0.963,0.962-2.539,0-3.502l-0.876-0.875c-0.963-0.964-2.539-0.964-3.501,0  L16,12.142L9.433,5.575c-0.962-0.963-2.538-0.963-3.501,0L5.056,6.45c-0.962,0.963-0.962,2.539,0,3.502l6.566,6.566l-6.566,6.567  c-0.962,0.963-0.962,2.538,0,3.501l0.876,0.876c0.963,0.963,2.539,0.963,3.501,0L16,20.896l6.567,6.566  c0.962,0.963,2.538,0.963,3.501,0l0.876-0.876c0.962-0.963,0.962-2.538,0-3.501L20.377,16.519z" fill="#515151"/></svg>-->
            <svg @click="removeField(item, index)" class="removeField" enable-background="new 0 0 256 256" height="256px" id="Layer_1" version="1.1" viewBox="0 0 256 256" width="256px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M137.051,128l75.475-75.475c2.5-2.5,2.5-6.551,0-9.051s-6.551-2.5-9.051,0L128,118.949L52.525,43.475  c-2.5-2.5-6.551-2.5-9.051,0s-2.5,6.551,0,9.051L118.949,128l-75.475,75.475c-2.5,2.5-2.5,6.551,0,9.051  c1.25,1.25,2.888,1.875,4.525,1.875s3.275-0.625,4.525-1.875L128,137.051l75.475,75.475c1.25,1.25,2.888,1.875,4.525,1.875  s3.275-0.625,4.525-1.875c2.5-2.5,2.5-6.551,0-9.051L137.051,128z"/></svg>
            <div class="field">
              <!--<label for="">Объект</label>-->
              <choosenSelect v-model="rows[index].object.value">
                <option value="rcsamara">РЦ Самара</option>
                <option value="rcuda">РЦ Уфа</option>
                <option value="x5">Пятерочка</option>
                <option value="magnit">Магнит</option>
              </choosenSelect>
            </div>
            <div class="field">
              <!--<label for="">Смена</label>-->
              <choosenSelect v-model="rows[index].shift.value">
                <option value="night">Ночная</option>
                <option value="day">Дневная</option>
              </choosenSelect>
            </div>
            <div class="field">
              <!--<label for="">Должность</label>-->
              <choosenSelect v-model="rows[index].position.value">
                <option value="gruzchik">Грузчик</option>
                <option value="komplektovzhik">Комплектовщик</option>
                <option value="brigadir">Бригадир</option>
              </choosenSelect>
            </div>
            <div class="field">
              <!--<label for="object">
                Дата
              </label><br>-->
              <date-picker :show-second="false" append-to-body v-model="rows[index].date.value" type="date" format="YYYY-MM-DD"></date-picker>
            </div>
            <!--<div class="field">
              <label for="object">
                Объект
              </label><br>
              <select :id="'select_object_' + item.object.id" class="form-control" name="object" type="text">
                <option value="">РЦ Самара</option>
                <option value="">РЦ Уфа</option>
                <option value="">Пятерочка</option>
                <option value="">Магнит</option>
              </select>
            </div>
            <div class="field">
              <label for="object">
                Должность
              </label><br>
              <select class="form-control" name="object" type="text">
                <option value="">РЦ Самара</option>
                <option value="">РЦ Уфа</option>
                <option value="">Пятерочка</option>
                <option value="">Магнит</option>
              </select>
            </div>
            <div class="field">
              <label for="object">
                Смена
              </label><br>
              <select class="form-control" name="object" type="text">
                <option value="">День</option>
                <option value="">Ночи</option>
              </select>
            </div>
            <div class="field">
              <label for="object">
                Дата
              </label><br>
              <date-picker :show-second="false" append-to-body v-model="rows[index].date.value" type="date" format="YYYY-MM-DD"></date-picker>
            </div>-->
          </div>
        </transition-group>

      </div>
      <svg @click="addField" class="iconAdd" fill="#000000" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 455 455" xml:space="preserve">
      <polygon points="455,212.5 242.5,212.5 242.5,0 212.5,0 212.5,212.5 0,212.5 0,242.5 212.5,242.5 212.5,455 242.5,455 242.5,242.5
        455,242.5 "/>
      </svg>
    </div>
    <button id="save_form_personal_target" form="form_personal_target" type="submit" accesskey="ы" class="btn btn-primary btn-sm"><i class="fas fa-save"></i>Сохранить
    </button>
  </div>
  `
}

export default table
