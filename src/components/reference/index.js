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
  <div class="reference">
    <div class="reference-list">
      <div v-for="(reference, index) in references" class="reference-list-element">
        {{ reference.word }} - {{ reference.description }}
      </div>
    </div>
  </div>
  `
}

export default tile
