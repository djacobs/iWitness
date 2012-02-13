var TwitterSearch = function(params){
  this.query       = new TwitterQuery(params);
  this.filter      = new TwitterFilter(params);
  console.log('*** searching %s - %s ***', params.start, params.end);
  this.total = 0;
  this.target = 0;
}

MicroEvent.mixin(TwitterSearch);

_.extend(TwitterSearch.prototype, {
  fetch: function(target){
    this.target += target;
    this.query.getNext(this.gotData.bind(this));
  },

  gotData: function(data){
    if(!data.results.length) return this.trigger('done');
    var filtered = this.filter.filter(data.results);

    console.log('%s to %s - %s found / %s passed',
                moment(_.first(data.results).created_at).format('MM/DD hh:mma'),
                moment(_.last(data.results).created_at).format('MM/DD hh:mma'),
                data.results.length,
                filtered.length);

    if (filtered.length) this.trigger('data', filtered);
    this.total += filtered.length;

    if (this.total >= this.target) {
      console.log('--- got %s total results ---', this.total);
      this.trigger('done');
    } else if ( !this.query.isDone ) {
      this.query.getNext(this.gotData.bind(this));
    } else {
      this.trigger('done');
    }
  }
});

