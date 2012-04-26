var ImageService = function(regex, urlFn) {
  this.regex = regex;
  this.urlFn = urlFn;
};

ImageService.prototype.match = function(url) {
  var matchObj = url.match(this.regex);
  if (matchObj) {
    return this.urlFn(matchObj);
  } else {
    return null;
  }
}

var ImageServices = [
  new ImageService(/instagr\.am\/p\/(.*?)\//, function(match) {return "http://instagr.am/p/"+ match[1] +"/media/?size=m";}),
  new ImageService(/twitpic\.com\/(\w+)/, function(match) { return "http://twitpic.com/show/large/"+ match[1];}),
  new ImageService(/yfrog\.com\/(\w+)/, function(match) { return "http://yfrog.com/"+ match[1] + ":iphone" ;}),
  new ImageService(/twitgoo\.com\/(\w+)/, function(match) { return "http://twitgoo.com/"+ match[1] + "/img" ;}),
  new ImageService(/lockerz\.com\/s\/(\w+)/, function(match) {
    return "http://api.plixi.com/api/tpapi.svc/imagefromurl?size=medium&amp;url=http%3A%2F%2Flockerz.com%2Fs%2F"+ match[1] ;
  })
];
