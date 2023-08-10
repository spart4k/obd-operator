import style from './css/style.css' assert { type: 'css' };
document.adoptedStyleSheets.push(style)

const tabs = {
  components: {
  },
  props: {
    tabs: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    removeField(item, index) {
      console.log(item, index)
      this.$emit('remove-field', item, index)
    },
    addField() {
      this.$emit('add-field')
    },
    chooseTab(tab) {
      this.$emit('choose-tab', tab)
    }
  },
  template: `
  <ul class="nav nav-tabs card-header-tabs d-lg-flex flex-lg-row d-flex tabs-nav">
    <li v-for="(tab, index) in tabs.list" :key="tab.id" class="nav-item tabs-nav-button" tab-button="expenses"><button @click="chooseTab(tab)" class="nav-link" :class="tab.active ? 'active' : ''" type="button">{{ tab.title }}</button></li>
    <!--<li class="nav-item tabs-nav-button" tab-button="tab2"><button class="nav-link active" type="button">История</button></li>-->
  </ul>
  `
}

export default tabs
