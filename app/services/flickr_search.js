var FlickrSearch = function(params){
  this.type = 'flickr'
  this.mapTimezoneOffset = params.mapTimezoneOffset;
  this.start             = this._adjustedMoment(params.start);
  this.end               = this._adjustedMoment(params.end);
  this.keyword           = params.keyword;
  this.boundingBox       = [params.southWest[1], params.southWest[0], params.northEast[1], params.northEast[0]].join(',');
  this.minUploadDate     = null;
  this.url               = 'http://api.flickr.com/services/rest/?jsoncallback=?'
  this.stream            = params.stream;
  this.page              = 0;
  this.filter            = new FlickrFilter(params);
}

_.extend(FlickrSearch.prototype, {
  fetch: function(target){
    this.perPage = target;
    this.page++;
    Ember.sendEvent(this, 'fetch');

    if (this.stream) {
      this.start = moment().subtract("hours", 1);
      this.end   = moment();
      $.getJSON(this.url, this._searchParams(), _.bind(this._startStreaming, this));
    } else {
      $.getJSON(this.url, this._searchParams(), _.bind(this._gotData, this));
    }
  },

  stop: function() {
    clearInterval(this.interval);
    Ember.sendEvent(this, 'done');
  },

  hasMorePages: function(){
    return this.pages > this.page;
  },

  _gotData: function(data){
    if (data.photos.photo.length){
      var maxPhoto = _.max(data.photos.photo, function(photo){
        return parseInt(photo.dateupload);
      });
      this.minUploadDate = parseInt(maxPhoto.dateupload)+1;
    }
    this.pages = data.photos.pages;
    var photos = this.filter.filter(data.photos.photo);
    Ember.sendEvent(this, 'data', photos);
    if(!this.stream){
      Ember.sendEvent(this, 'done');
    } else {
      Ember.sendEvent(this, 'streaming');
    }
  },

  _startStreaming: function(data){
    var self = this;
    this._gotData(data);

    IWitness.log("start flickr stream");
    self.minUploadDate = self.minUploadDate || Math.ceil(moment().valueOf() / 1000);
    self.interval = setInterval(function(){
      $.getJSON(self.url, self._streamParams(), _.bind(self._gotData, self));
    }, IWitness.config.pollInterval*1000);
  },

  _adjustedMoment: function(time) {
    return moment(time).add('hours', this.mapTimezoneOffset);
  },

  _toSeconds: function(time) {
    return Math.ceil(time.valueOf() / 1000);
  },

  _searchParams: function(){
    return {
      api_key:         window.flickrApiKey,
      bbox:            this.boundingBox,
      sort:            'date-taken-desc',
      min_taken_date:  this._toSeconds(this.start),
      max_taken_date:  this._toSeconds(this.end),
      text:            this.keyword,
      method:          'flickr.photos.search',
      format:          'json',
      page:            this.page,
      per_page:        this.perPage,
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
      min_upload_date: this.minUploadDate,
      max_taken_date:  this._toSeconds(this._adjustedMoment(moment().add("minutes", 29)))
    }
  }
});
