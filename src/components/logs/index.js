import style from './css/style.css' assert { type: 'css' };
document.adoptedStyleSheets.push(style)

const tile = {
  components: {
  },
  props: {
    logs: {
      type: Array,
      default: () => []
    }
  },
  methods: {

  },
  template: `
  <div class="logs">
    <div class="logs-list">
      <div v-for="(log, index) in logs" class="logs-list-element">
        [{{ log.date }}] {{ log.text }} {{ log.task }}: автор - {{ log.author }}
      </div>
    </div>
  </div>
  `
}

export default tile
