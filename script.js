const { createApp } = Vue

createApp({
  data() {
    return {
      term: '',
      resultCount: 0,
      original: [],
      unsorted: [],
      sorted: [],
      results: [],
      genre_list: [],
      selected_buttons: ['ALL'],
      reset: true,
      name: false,
      price: false,
    }
  },
  methods: {
    search: function () {
      fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(this.term)}&media=music&limit=50`
      ).then(
        res => res.json()
      ).then(
        data => {
          console.log(data)
          this.results = data.results
          this.original = data.results
          this.unsorted = data.results
          this.sorted = data.results
          this.resultCount = data.resultCount
          this.genre_list = []
          this.reset = true
          this.name = false
          this.price = false
          this.selected_buttons = ['ALL']
          if (data.resultCount === 0) {
            alert("No artist was found with the name \"" + this.term + "\"")
          }
          // loop thru returned api call to get genres included
          for (let i = 0; i < this.resultCount; i++) { 
            if (!this.genre_list.includes(this.results[i].primaryGenreName)) {
              this.genre_list.push(this.results[i].primaryGenreName)
            }
          }
        }
      )
    }, 
    button_select: function(genre) {
      // if genre is already selected, deselect it
      if (this.selected_buttons.includes(genre)) {
        if (genre != 'ALL') {
          if (this.selected_buttons.length > 1) {
            this.selected_buttons.splice(this.selected_buttons.indexOf(genre), 1)
          }
          else {
            this.selected_buttons = []
            this.selected_buttons.push('ALL')
          }
        }
      }
      // if genre is not selected, select it
      else {
        if (this.selected_buttons.includes('ALL')) {
          this.selected_buttons.splice(this.selected_buttons.indexOf('ALL'), 1)
        }
        if (genre === 'ALL') {
          this.selected_buttons = []
          this.selected_buttons.push('ALL')
        }
        else {
          this.selected_buttons.push(genre)
        }
      }

      // if all is the only genre selected
      if (this.selected_buttons.length === 1 && this.selected_buttons[0] === 'ALL') {
        this.results = this.original
        this.resultCount = this.original.length
      }
      // else
      else {
        this.results = []
        this.resultCount = 0
        for (let j = 0; j < this.original.length; j++) {
          if (this.selected_buttons.includes(this.original[j].primaryGenreName)) {
            this.results.push(this.original[j])
            this.resultCount += 1
          }
        }
      }
      this.unsorted = []
      this.unsorted = this.unsorted.concat(this.results)
      if (this.reset) {this.select_sort('reset')}
      else if (this.name) {this.select_sort('name')}
      else if (this.price){this.select_sort('price')}
    },

    select_sort: function(type) {
      this.sorted = []
      this.sorted = this.sorted.concat(this.unsorted)
      if (type === 'reset') {
        this.results = this.unsorted
        this.reset = true
        this.name = false
        this.price = false
      }
      else if (type === 'name') {
        this.results = this.sorted.sort((y,z) => {
          if (y.collectionCensoredName < z.collectionCensoredName) {
            return -1
          }
          if (y.collectionCensoredName > z.collectionCensoredName) {
            return 1
          }
          return 0
        })
        this.reset = false
        this.name = true
        this.price = false
      }
      else if (type === 'price') {
        this.results = this.sorted.sort((y,z) => {return y.collectionPrice - z.collectionPrice})
        this.reset = false
        this.name = false
        this.price = true
      }
    }
  }
}).mount('#app')