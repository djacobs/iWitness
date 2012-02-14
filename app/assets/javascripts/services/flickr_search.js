var FlickrSearch = function(params){
  this.start     = moment(params.start);
  this.end       = moment(params.end);
  this.keyword   = params.keyword;
  this.flickrKey = params.flickrKey;
  this.lat       = params.center[0];
  this.lng       = params.center[1];
  this.radius    = params.radius;
  this.target    = 0;
  this.total     = 0;
  console.log('*** searching Flickr %s - %s ***', params.start, params.end);
}

MicroEvent.mixin(FlickrSearch);

_.extend(FlickrSearch.prototype, {
  fetch: function(target){
    this.target += target;

    var url = 'http://api.flickr.com/services/rest/?jsoncallback=?'
    $.getJSON(url, this._flickrParams(), this._gotData.bind(this));
  },

  _gotData: function(data){
    console.log(data);
    this.trigger('data', data.photos.photo);
    this.trigger('done');
  },

  _flickrParams: function(){
    return {
      api_key:        this.flickrKey,
      lat:            this.lat,
      lon:            this.lng,
      radius:         this.radius,
      radius_units:   'km',
      per_page:       100, // max 500
      sort:           'date-taken-desc',
      min_upload_date: this.start.formatUTC("YYYY-MM-DD HH:mm:ss"),
      max_upload_date: this.end.formatUTC("YYYY-MM-DD HH:mm:ss"),
      text:           this.keyword,
      method:         'flickr.photos.search',
      format:         'json',
      extras:         'geo,url_s,date_taken,owner_name'
    }
  }
});

