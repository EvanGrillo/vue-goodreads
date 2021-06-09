window.addEventListener('load', function () {
    
    var app = new Vue({
        el: '#app',
        vuetify: new Vuetify(),
        data: {
            loading: false,
            search: '',
            page: 1,
            total_pages: 0,
            q_result: {},
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
                if (!this.q_result.results) return [];
                return this.q_result.results.map((item) => {
                    return {
                        _id: item._id,
                        author: item.author,
                        title: item.title,
                        avg_rating: Number(item.average_rating) || 'NA',
                        year: Number(item.publish_year),
                        cover_image: item.image_url,
                        publish_date: {
                            month: Number(item.publish_month),
                            day: Number(item.publish_day),
                            year: Number(item.publish_year),
                        }
                    }
                });
            },
            total_results: function () {
                if (!this.q_result) return 0;
                return Number(this.q_result.total_results) || 0;
            },
            query: function () {
                if (!this.q_result) return '';
                return this.q_result.query;
            }
        },
        methods: {
            search_query: function() {
                app.loading = true;
                analyze_search_str();
                search_query();
            },
            paginate_search: function(val) {
                window.scrollTo(0,0);
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

    search_query = async () => {

        try {
            const search = await axios.get(`/api/goodreads/?search=${app.search}&page=${app.page}`);
            app.q_result = search.data;
            app.total_pages = Math.ceil(app.total_results / 20);
            if (!search.data.results.length) {
                app.alert_config = {
                    open: true,
                    color: '#D50000',
                    message: 'No results. Try to refine your search.'
                }
            }
        } catch (err) {
            app.alert_config = {
                open: true,
                color: '#D50000',
                message: err.message
            }
        }
        app.loading = false;
    }

    analyze_search_str = () => {
        results = (/[?&]page(=([^&#]*)|&|#|$)/).exec(app.search);
        if (!results) {
            return app.page = 1;
        }
        page = decodeURIComponent(results[2].replace(/\+/g, ' '));
        app.page = Number(page);
        app.search = app.search.split(/[?]|[&]/)[0];
    }

})
