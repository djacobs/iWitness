// regex must contain one capture group that identifies the
// replacement to insert into the replacementPattern
var ImageService = function(name, tagType, regex, replacementPattern) {
  this.name        = name;
  this.tagType     = tagType;
  this.regex       = regex;
  this.replacement = replacementPattern;
};

_.extend(ImageService.prototype, {
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

var ImageServices = [
  new ImageService("instagram", "img",    /instagr\.am\/p\/(.*?)\//, "http://instagr.am/p/$1/media/?size=m"),
  new ImageService("twitpic",   "img",    /twitpic\.com\/(\w+)/,     "http://twitpic.com/show/large/$1"),
  new ImageService("yfrog",     "iframe", /yfrog\.com\/(\w+)/,       "http://yfrog.com/$1:iphone"),
  new ImageService("twitgoo",   "img",    /twitgoo\.com\/(\w+)/,     "http://twitgoo.com/$1/img"),
  new ImageService("lockerz",   "img",    /lockerz\.com\/s\/(\w+)/,
                   "http://api.plixi.com/api/tpapi.svc/imagefromurl?size=medium&url=http%3A%2F%2Flockerz.com%2Fs%2F$1")
];

var Media = function(media) {
  this.media = media;
  if (media.media_url) {
    this.fromTwitter();
  } else {
    this.fromUrl();
  }
}

_.extend(Media.prototype, {
  fromUrl: function() {
    this.url = this.media.expanded_url;
    var imageService = this.findMedia(this.url);
    if (imageService) {
      this.mediaUrl = imageService.convert(this.url);
      this.tagType  = imageService.tagType;
    }
  },

  fromTwitter: function() {
    this.url      = this.media.url;
    this.mediaUrl = this.media.media_url+":small";
  },

  findMedia: function(url) {
    return _.find(ImageServices, function(svc) {
      return svc.match(url);
    });
  }
});
