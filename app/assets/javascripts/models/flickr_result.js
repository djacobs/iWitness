IWitness.FlickrResult = Ember.Object.extend({
  isFlickr: true,
  latBinding: 'latitude',
  lngBinding: 'longitude',

  timestamp: function() {
    return moment(this.get('datetaken')).format('M/D h:mma');
  }.property('datetaken'),

  profileUrl: function(){
    return "http://www.flickr.com/photos/" + this.get('owner');
  }.property('owner'),

  profilePicUrl: function(){
    return "http://flickr.com/buddyicons/" + this.get('owner') + ".jpg";
  }.property('owner'),

  permalinkUrl: function() {
    return "http://flickr.com/photos/" + this.get('owner') + "/" + this.get('id');
  }.property('owner', 'id')
});

IWitness.FlickrResult.import = function(obj) {
  var camelCased = {};
  var newKey;

  for (var k in obj) {
    newKey = k.replace(/_(\w)/g, function(match, char) {
      return char.toUpperCase();
    });
    camelCased[newKey] = obj[k];
  }

  return IWitness.FlickrResult.create(camelCased);
};
