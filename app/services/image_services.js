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
  init: function() {
    if (this.get('media_url')) {
      this.fromTwitter();
    } else {
      this.fromUrl();
    }
  },

  fromUrl: function() {
    this.set('url', 'expanded_url');
    var MediaService = this._findMedia(this.get('url'));
    if (MediaService) {
      this.set('mediaUrl', MediaService.convert(this.get('url')));
      this.set('tagType', MediaService.tagType);
    }
  },

  fromTwitter: function() {
    this.set('mediaUrl', this.get('media_url') + ':small');
    this.set('tagType', 'img');
  },

  _findMedia: function(url) {
    return _.find(MediaServices, function(svc) {
      return svc.match(url);
    });
  }
});
