var FlickrSearch = function(params){
  this.type = 'flickr'
  this.start              = moment(params.start);
  this.end                = moment(params.end);
  this.keyword            = params.keyword;
  this.boundingBox        = [params.southWest[1], params.southWest[0], params.northEast[1], params.northEast[0]].join(',');
  this.mapTimezoneOffset  = params.mapTimezoneOffset;
  this.target             = 0;
  this.total              = 0;
  this.minUploadDate      = null;
  this.url                = 'http://api.flickr.com/services/rest/?jsoncallback=?'
  IWitness.log('*** searching Flickr %s - %s ***', params.start, params.end);
}

_.extend(FlickrSearch.prototype, {
  fetch: function(target){
    this.target += target;

    $.getJSON(this.url, this._searchParams(), _.bind(this._gotData, this));
  },

  startStreaming: function(pollInterval){
    var self = this;
    self.streaming = true;
    self.minUploadDate = self.minUploadDate || self._adjustTime(moment());
    self.interval = setInterval(function(){
      IWitness.log('request:', self._streamParams());
      $.getJSON(self.url, self._streamParams(), _.bind(self._gotData, self));
    }, pollInterval*1000);
  },

  stop: function() {
    clearInterval(this.interval);
  },

  _gotData: function(data){
    IWitness.log("got flickr results: %o", data);
    if (data.photos.photo.length){
      var maxPhoto = _.max(data.photos.photo, function(photo){
        return parseInt(photo.dateupload);
      });
      this.minUploadDate = parseInt(maxPhoto.dateupload)+1;
    }
    Ember.sendEvent(this, 'data', data.photos.photo);
    if(!this.streaming){
      Ember.sendEvent(this, 'done');
    }
  },

  _adjustTime: function(time) {
    var time = moment(time); // don't mutate the original time

    time.add('hours', this.mapTimezoneOffset);

    return Math.ceil(time.valueOf() / 1000); // provide a unix timestamp without milliseconds
  },

  _searchParams: function(){
    return {
      api_key:         'd8e03d0c91caffad9c85eccb1a54dc18',
      bbox:            this.boundingBox,
      sort:            'date-taken-desc',
      min_taken_date:  this._adjustTime(this.start),
      max_taken_date:  this._adjustTime(this.end),
      text:            this.keyword,
      method:          'flickr.photos.search',
      format:          'json',
      extras:          'geo,url_s,date_taken,date_upload,owner_name,description',
    }
  },

  _streamParams: function(){
    return {
      api_key:         'd8e03d0c91caffad9c85eccb1a54dc18',
      bbox:            this.boundingBox,
      sort:            'date-taken-desc',
      text:            this.keyword,
      method:          'flickr.photos.search',
      format:          'json',
      extras:          'geo,url_s,date_taken,date_upload,owner_name,description',
      min_upload_date: this.minUploadDate
    }
  }
});

