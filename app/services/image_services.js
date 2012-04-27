// regex must contain one capture group that identifies the
// replacement to insert into the replacementPattern
var MediaService = function(name, tagType, regex, replacementPattern) {
  this.name        = name;
  this.tagType     = tagType;
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
  new MediaService("instagram", "img",    /instagr\.am\/p\/(.*?)\//, "http://instagr.am/p/$1/media/?size=m"),
  new MediaService("twitpic",   "img",    /twitpic\.com\/(\w+)/,     "http://twitpic.com/show/large/$1"),
//  new MediaService("yfrog",     "iframe", /yfrog\.com\/(\w+)/,       "http://yfrog.com/$1:iphone"),
  new MediaService("twitgoo",   "img",    /twitgoo\.com\/(\w+)/,     "http://twitgoo.com/$1/img"),
  new MediaService("lockerz",   "img",    /lockerz\.com\/s\/(\w+)/,
                   "http://api.plixi.com/api/tpapi.svc/imagefromurl?size=medium&url=http%3A%2F%2Flockerz.com%2Fs%2F$1"),
  new MediaService("youtube",   "iframe",    /youtu\.be\/([\w\-]+)/,     "http://www.youtube.com/embed/$1"),
  new MediaService("youtube2",   "iframe",    /youtube.com\/watch.*[?&]v=([\w\-]+)/,     "http://www.youtube.com/embed/$1"),
];

IWitness.Media = Ember.Object.extend({
  tagType:  null,
  linkUrl:      null,
  mediaUrl: null,
  canDisplayBinding: Ember.Binding.and("tagType", "linkUrl", "mediaUrl")
});

IWitness.TwitterHostedMedia = IWitness.Media.extend({
  tagType: 'img',
  linkUrlBinding: 'url',

  mediaUrl: function(){
    return this.get('media_url') + ':small';
  }.property("media_url"),

  isPhoto: function() {
    return this.get('type') == 'photo';
  }.property('type'),

  canDisplayBinding: Ember.Binding.and("isPhoto", "tagType", "linkUrl", "mediaUrl")
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

  tagType: function(){
    var service = this.get("service");
    if (service) return service.tagType;
    return null;
  }.property("service")

});
