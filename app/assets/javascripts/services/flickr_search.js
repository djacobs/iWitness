var FlickrSearch = function(params){
  this.start              = moment(params.start);
  this.end                = moment(params.end);
  this.keyword            = params.keyword;
  this.flickrKey          = params.flickrKey;
  this.lat                = params.center[0];
  this.lng                = params.center[1];
  this.radius             = params.radius;
  this.timezoneDifference = params.timezoneDifference;
  this.target             = 0;
  this.total              = 0;
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
    this.trigger('data', 'flickr', data.photos.photo);
    this.trigger('done', 'flickr');
  },

  _adjustTime: function(time) {
    var time = moment(time); // don't mutate the original time
    time.subtract('hours', 5); // compensate for flickr offset
    time.subtract('hours', this.timezoneDifference); // compensate for map time zone

    return Math.ceil(time.valueOf() / 1000); // provide a unix timestamp without milliseconds
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

      // min_upload_date: Math.ceil(this.start.valueOf() / 1000), // results match criteria
      // max_upload_date: Math.ceil(this.end.valueOf() / 1000),
      // min_upload_date: this.start.formatPST("YYYY-MM-DD HH:mm:ss"), // results match criteria
      // max_upload_date: this.end.formatPST("YYYY-MM-DD HH:mm:ss"),
      // min_upload_date: this.start.format("YYYY-MM-DD HH:mm:ss"), // results 3 hours later
      // max_upload_date: this.end.format("YYYY-MM-DD HH:mm:ss"),
      // min_upload_date: this.start.formatUTC("YYYY-MM-DD HH:mm:ss"), // results 8 hours later
      // max_upload_date: this.end.formatUTC("YYYY-MM-DD HH:mm:ss"),

      // - taken_date is searched based on raw time from camera, regardless of time zone
      // - no way to know if taken_date is in time zone of photo or user profile
      // - flickr results are offset from search criteria by 5 hours (don't know why)

      // if we assume taken_date is in time zone of photo:
      //   - manipulate start/end using the diff of browser timezone to timezone of map center
      //   - subtract 5 more hours from start/end to make up for unexplainable offset

      min_taken_date: this._adjustTime(this.start), // results match criteria
      max_taken_date: this._adjustTime(this.end),
      // min_taken_date: Math.ceil(this.start.valueOf() / 1000), // results 5 hours later
      // max_taken_date: Math.ceil(this.end.valueOf() / 1000),
      // min_taken_date: this.start.formatPST("YYYY-MM-DD HH:mm:ss"), // results 5 hours later
      // max_taken_date: this.end.formatPST("YYYY-MM-DD HH:mm:ss"),
      // min_taken_date: this.start.format("YYYY-MM-DD HH:mm:ss"), // results 8 hours later
      // max_taken_date: this.end.format("YYYY-MM-DD HH:mm:ss"),
      // min_taken_date: this.start.formatUTC("YYYY-MM-DD HH:mm:ss"), // results 13 hours later
      // max_taken_date: this.end.formatUTC("YYYY-MM-DD HH:mm:ss"),

      text:           this.keyword,
      method:         'flickr.photos.search',
      format:         'json',
      extras:         'geo,url_s,date_taken,date_upload,owner_name,description'
    }
  }
});

