import style from './css/style.css' assert { type: 'css' };
document.adoptedStyleSheets.push(style)

const tile = {
  components: {
  },
  props: {

  },
  methods: {

  },
  template: `
  <div class="tile">
    <slot/>
  </div>
  `
}

export default tile
