IWitness.Media = Ember.Object.extend({
  serviceType: null,
  linkUrl:     null,
  mediaUrl:    null,
  canDisplayBinding: Ember.Binding.and("serviceType", "linkUrl", "mediaUrl")
});

IWitness.TwitterHostedMedia = IWitness.Media.extend({
  serviceType: 'photo',
  linkUrlBinding: 'url',

  mediaUrl: function(){
    return this.get('media_url') + ':small';
  }.property("media_url"),

  isPhoto: function() {
    return this.get('type') == 'photo';
  }.property('type'),

  canDisplayBinding: Ember.Binding.and("isPhoto", "serviceType", "linkUrl", "mediaUrl")
});

IWitness.TwitterLinkedMedia = IWitness.Media.extend({
  linkUrlBinding: "expanded_url",

  mediaUrl: function(){
    var service = this.get("service");
    if (service) {
      var matchObj = this.get('linkUrl').match(service.regex);
      if (matchObj) return service.replacementPattern.replace("$1", matchObj[1]);
    }
  }.property("service", "linkUrl"),

  serviceType: function(){
    var service = this.get("service");
    if (service) return service.serviceType;
  }.property("service"),

  service: function(){
    var linkUrl = this.get("linkUrl");
    return _.find(this._mediaServices, function(svc) {
      return linkUrl.match(svc.regex);
    });
  }.property("linkUrl"),

  // regex must contain one match group
  // replacementPattern specifies where to insert that match group with "$1"
  _mediaServices: [
    {
      serviceType:        "photo",
      regex:              /instagr\.am\/p\/(.*?)\//,
      replacementPattern: "http://instagr.am/p/$1/media/?size=m"
    }, {
      serviceType:        "photo",
      regex:              /twitpic\.com\/(\w+)/,
      replacementPattern: "http://twitpic.com/show/large/$1"
    }, {
      serviceType:        "photo",
      regex:              /twitgoo\.com\/(\w+)/,
      replacementPattern: "http://twitgoo.com/$1/img"
    }, {
      serviceType:        "photo",
      regex:              /lockerz\.com\/s\/(\w+)/,
      replacementPattern: "http://api.plixi.com/api/tpapi.svc/imagefromurl?size=medium&url=http%3A%2F%2Flockerz.com%2Fs%2F$1"
    }, {
      serviceType:        "video",
      regex:              /youtu\.be\/([\w\-]+)/,
      replacementPattern: "http://www.youtube.com/embed/$1"
    }, {
      serviceType:        "video",
      regex:              /youtube.com\/watch.*[?&]v=([\w\-]+)/,
      replacementPattern: "http://www.youtube.com/embed/$1"
    }, {
      serviceType:        "video",
      regex:              /twitvid.com\/(\w+)/,
      replacementPattern: "http://www.twitvid.com/embed.php?autoplay=0&guid=$1"
    }, {
      serviceType:        "video",
      regex:              /vimeo.com\/(?:m\/)?(\w+)/,
      replacementPattern: "http://player.vimeo.com/video/$1"
    }
  ]
  //  new MediaService("photo", /yfrog\.com\/(\w+)/,       "http://yfrog.com/$1:iphone"),
});
