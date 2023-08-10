import style from './css/style.css' assert { type: 'css' };
document.adoptedStyleSheets.push(style)

const tile = {
  components: {
  },
  props: {
    references: {
      type: Array,
      default: () => []
    }
  },
  methods: {

  },
  template: `
  <div class="hint">
    <div class="hint-list">
      <div v-for="(hint, index) in 6" class="hint-list-element">
        Найдено совпадение с уже добавленной задачей на основе этого запроса
      </div>
    </div>
  </div>
  `
}

export default tile
