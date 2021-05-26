window.addEventListener('load', function () {
    
    var app = new Vue({
        el: '#app',
        vuetify: new Vuetify(),
        data: {
            loading: false,
            search: '',
            page: 1,
            total_pages: 0,
            q_result: null,
            headers: [
                { text: 'Author', value: 'author' },
                { text: 'Title', value: 'title' },
                { text: 'Avg. Rating', value: 'avg_rating'},
                { text: 'Year', value: 'year' }
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
                return this.q_result.results.work.map((item) => {
                    return {
                        _id: item.id.$t,
                        author: item.best_book.author.name,
                        title: item.best_book.title,
                        avg_rating: parseInt(item.average_rating) || 'NA',
                        year: item.original_publication_year.$t,
                        cover_image: item.best_book.image_url,
                        publish_date: {
                            month: parseInt(item.original_publication_month.$t) || null,
                            day: parseInt(item.original_publication_day.$t) || null,
                            year: parseInt(item.original_publication_year.$t) || null,
                        }
                    }
                });
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
            paginate_search: function(val) {
                app.loading = true;
                app.page = val;
                search_query();
            },
            formatDate: function(item) {
                let checks = [
                    !item.publish_date.month,
                    !item.publish_date.day,
                    !item.publish_date.year
                ]
                if (checks.includes(true)) {return 'NA'};
                let date = `\n
                ${item.publish_date.month}/\n
				${item.publish_date.day}/\n
				${item.publish_date.year}`;
                return date.replace(/(\r\n|\t|\n|\r|\t)/gm,"");
            }
        }
    })

    var search_query = async () => {
        
        try {
            const search = await axios.get(`/api/goodreads/?search=${app.search}&page=${app.page}`);
            app.q_result = search.data;
            app.total_pages = parseInt(app.total_results / 20);
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
