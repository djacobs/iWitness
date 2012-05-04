IWitness.FlickrResult = IWitness.Result.extend({
  resultType:             'flickr',
  permalinkText:          'flickr',

  init: function(){
    this._initMedia();
    this.setProperties({
      lat: this.get("latitude"),
      lng: this.get("longitude"),
      avatarSrc: this.get("profilePicUrl"),
      userNamePrimary: this.get("ownername"),
      contentText: this.getPath("description._content")
    });
  },

  resultId: function(){
    return this.get('resultType') +'-'+ this.get('id');
  }.property('id'),

  postedMoment: function() {
    return FlickrFilter.offsetFlickrTime(this.get("datetaken"), IWitness.criteria.get("mapTimezoneOffset"));
  }.property('datetaken'),

  userUrl: function(){
    return "http://www.flickr.com/photos/" + this.get('owner');
  }.property('owner'),

  profilePicUrl: function(){
    return "http://flickr.com/buddyicons/" + this.get('owner') + ".jpg";
  }.property('owner'),

  permalinkUrl: function() {
    return "http://flickr.com/photos/" + this.get('owner') + "/" + this.get('id');
  }.property('owner', 'id'),

  _initMedia: function() {
    var media = IWitness.Media.create({
      serviceType:  'photo',
      linkUrl:      this.get("permalinkUrl"),
      mediaUrl:     this.get("urlS")
    });
    this.set("media", IWitness.MediaCollection.create({content: [media]}));
  },

  fetchEmbed: function(){
    this.set('embedHtml',
             "<a href='"+ this.get('permalinkUrl') +"'><img src='"+ this.get('contentSrc') +"' /></a>"
             + "<p>"+ this.get('title') +" by "+ this.get('userNamePrimary') +" on "
             + "<a href='"+ this.get('permalinkUrl') +"'>Flickr</a>.</p>");

  }

});
