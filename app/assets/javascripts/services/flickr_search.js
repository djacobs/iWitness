var FlickrSearch = function(params){
  this.type = 'flickr'
  this.start              = moment(params.start);
  this.end                = moment(params.end);
  this.keyword            = params.keyword;
  this.flickrKey          = params.flickrKey;
  this.boundingBox        = [params.southWest[1], params.southWest[0], params.northEast[1], params.northEast[0]].join(',');
  this.mapTimezoneOffset  = params.mapTimezoneOffset;
  this.target             = 0;
  this.total              = 0;
  IWitness.log('*** searching Flickr %s - %s ***', params.start, params.end);
}

_.extend(FlickrSearch.prototype, {
  fetch: function(target){
    this.target += target;

    var url = 'http://api.flickr.com/services/rest/?jsoncallback=?'
    $.getJSON(url, this._flickrParams(), _.bind(this._gotData, this));
  },

  _gotData: function(data){
    Ember.sendEvent(this, 'data', data.photos.photo);
    Ember.sendEvent(this, 'done');
  },

  _adjustTime: function(time) {
    var time = moment(time); // don't mutate the original time

    time.add('hours', this.mapTimezoneOffset);

    return Math.ceil(time.valueOf() / 1000); // provide a unix timestamp without milliseconds
  },

  _flickrParams: function(){

    return {
      api_key:        this.flickrKey,
      bbox:           this.boundingBox,
      sort:           'date-taken-desc',
      min_taken_date: this._adjustTime(this.start),
      max_taken_date: this._adjustTime(this.end),
      text:           this.keyword,
      method:         'flickr.photos.search',
      format:         'json',
      extras:         'geo,url_s,date_taken,date_upload,owner_name,description'
    }
  }
});

