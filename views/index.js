window.addEventListener('load', function () {
    
    var app = new Vue({
        el: '#app',
        vuetify: new Vuetify(),
        data: {
            loading: false,
            search: '',
            q_result: null,
            headers: [
                { text: 'Author', value: 'best_book.author.name' },
                { text: 'Title', value: 'best_book.title' },
                { text: 'Avg. Rating', value: 'average_rating' },
                { text: 'Year', value: 'original_publication_year.$t' }
            ],
            alert_config: {
                open: false,
                message: '',
                color: '#00C853'
            }
            
        },
        computed: {
            works: function () {
              if (!this.q_result) return [];
              return this.q_result.results.work;
            },
            total_results: function () {
                if (!this.q_result) return 0;
                return this.q_result['total-results'];
            },
            query: function () {
                if (!this.q_result) return '';
                return this.q_result.query;
            }
        },
        methods: {
            search_query: function() {
                app.loading = true;
                search_query();
            },
            formatDate: function(item) {
                let checks = [
                    item.original_publication_month.nil === "true",
                    item.original_publication_day.nil === "true",
                    item.original_publication_year.nil === "true"
                ]
                if (checks.includes(true)) {return 'NA'};
                return `${item.original_publication_month.$t.trim()}/\n
				${item.original_publication_day.$t.trim()}/\n
				${item.original_publication_year.$t.trim()}`
            }
        }
    })

    var search_query = async () => {
        try {
            const search = await axios.get(`/api/goodreads/?search=${app.search}&skip=0`);
            app.q_result = search.data;
        } catch (err) {
            app.alert_config = {
                open: true,
                color: '#D50000',
                message: err.message
            }
        }
        
        app.loading = false;
    }

})
