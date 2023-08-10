import choosenSelect from "../src/components/choosenSelect/index.js"
import tableobd from "../src/components/table/index.js"
import tabs from "../src/components/tabs/index.js"
import tile from "../src/components/tile/index.js"
import logs from "../src/components/logs/index.js"
import reference from "../src/components/reference/index.js"
import hints from "../src/components/hints/index.js"

new Vue({
		el: '#obd',
		components: {
      DatePicker: window['DatePicker'],
      vue2Dropzone: window['vue2Dropzone'],
      choosenSelect,
      tableobd,
      tabs,
      tile,
      logs,
      reference,
      hints
		},
		data: {
      rows: [],
      time3: null,
      tabs: {
        list: [
          {
            id: 0,
            title: 'Таблица',
            active: true,
            value: 'tableobd'
          },
          //{
          //  id: 1,
          //  title: 'Справка',
          //  active: false,
          //  value: 'reference'
          //},
          {
            id: 2,
            title: 'Лог',
            active: false,
            value: 'logs'
          },
        ]
      },
      logs: [
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        },
        {
          date: '10.06.2023 10:20',
          author: 'Aleksey',
          task: 10,
          text: 'Была создана задача',
        }
      ],
      references: [
        {
          word: 'Грузчик',
          description: 'это профессия, в которой используется преимущественно только мускульная физическая сила человека для выполнения разных рабочих операций по перемещению грузов: погрузки, выгрузки, кантования, перекатывания и подъёма. В ряде случаев также используются приспособления для облегчения тяжёлого физического труда.'
        },
        {
          word: 'Кладовщик/комплектовщик',
          description: 'это специалист по правильному хранению и учету различных продуктов и товаров. Его задача – принимать и хранить товарно-материальные ценности и отгружать их в соответствии с расходными документами.'
        },
        {
          word: 'Водитель погрузчика',
          description: 'это специалист, который управляет погрузчиком и всеми механизмами, приспособленными для погрузочно-разгрузочных и грузозахватных работ. Водитель несет ответственность за сохранность этих грузов, поэтому должен обращаться с грузом аккуратно, тщательно и неторопливо.'
        }
      ]
		},

		methods: {
      getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
      },
      addField() {
        this.rows.push({
          id: this.getRandomArbitrary(0, 10000),
          object: {
            title: '',
            id: '',
            value: ''
          },
          position: {
            title: '',
            id: '',
            value: ''
          },
          date: {
            title: '',
            id: '',
            value: ''
          },
          shift: {
            title: '',
            id: '',
            value: ''
          },
        })
      },
      removeField(item, index) {
        console.log(1)
        const indexEl = this.rows.indexOf(item)
        this.rows.splice(indexEl, 1)
      },
      chooseTab(tab) {
        console.log(tab)
        this.tabs.list.forEach((item) => {
          item.active = false
          if (item.id === tab.id) {
            item.active = true
          }
        })
      }
		},
		computed: {
      activeTab() {
        return this.tabs.list.find((el) => el.active)
      }
		},
		watch: {
		},
		mounted() {
      console.log(vue2Dropzone)
      for (let i = 0; i < 5; i++) { // выведет 0, затем 1, затем 2
        this.rows.push({
          id: this.getRandomArbitrary(0, 10000),
          object: {
            title: '',
            id: i,
            value: ''
          },
          position: {
            title: '',
            id: i,
            value: ''
          },
          date: {
            title: '',
            id: i,
            value: ''
          },
          shift: {
            title: '',
            id: i,
            value: ''
          },
        })
      }
		},
    beforeDestroy() {
    }
})

console.log(initSelect)