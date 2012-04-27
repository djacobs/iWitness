// regex must contain one capture group that identifies the
// replacement to insert into the replacementPattern
var MediaService = function(svcType, regex, replacementPattern) {
  this.serviceType = svcType;
  this.regex       = regex;
  this.replacement = replacementPattern;
};

_.extend(MediaService.prototype, {
  match: function(url) {
    return url.match(this.regex);
  },

  convert: function(url) {
    var matchObj = this.match(url);
    if (matchObj) {
      return this.replacement.replace("$1", matchObj[1]);
    } else {
      return null;
    }
  }
});

var MediaServices = [
  new MediaService("picture", /instagr\.am\/p\/(.*?)\//, "http://instagr.am/p/$1/media/?size=m"),
  new MediaService("picture", /twitpic\.com\/(\w+)/,     "http://twitpic.com/show/large/$1"),
  new MediaService("picture", /twitgoo\.com\/(\w+)/,     "http://twitgoo.com/$1/img"),
  new MediaService("picture", /lockerz\.com\/s\/(\w+)/,
                   "http://api.plixi.com/api/tpapi.svc/imagefromurl?size=medium&url=http%3A%2F%2Flockerz.com%2Fs%2F$1"),
  new MediaService("video",  /youtu\.be\/([\w\-]+)/,     "http://www.youtube.com/embed/$1"),
  new MediaService("video",  /youtube.com\/watch.*[?&]v=([\w\-]+)/,     "http://www.youtube.com/embed/$1")
//  new MediaService("picture", /yfrog\.com\/(\w+)/,       "http://yfrog.com/$1:iphone"),
];

IWitness.Media = Ember.Object.extend({
  serviceType: null,
  linkUrl:     null,
  mediaUrl:    null,
  canDisplayBinding: Ember.Binding.and("serviceType", "linkUrl", "mediaUrl")
});

IWitness.TwitterHostedMedia = IWitness.Media.extend({
  serviceType: 'picture',
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

  service: function(){
    var linkUrl = this.get("linkUrl");
    return _.find(MediaServices, function(svc) {
      return svc.match(linkUrl);
    });
  }.property("linkUrl").cacheable(),

  mediaUrl: function(){
    var service = this.get("service");
    if (service) return service.convert(this.get('linkUrl'));
    return null;
  }.property("service", "linkUrl"),

  serviceType: function(){
    var service = this.get("service");
    if (service) return service.serviceType;
    return null;
  }.property("service")

});

IWitness.MediaCollection = Ember.ArrayController.extend({
  displayable: function(){
    return this.filterProperty("canDisplay");
  }.property("@each")
});
