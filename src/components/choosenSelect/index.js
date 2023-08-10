const choosenSelect = {
  props:["value"],
  template:`<select class="cs-select" :value="value"><slot></slot></select>`,
  mounted(){
    $(this.$el)
      .chosen()
      .on("change", () => this.$emit('input', $(this.$el).val()))
  }
}

export default choosenSelect