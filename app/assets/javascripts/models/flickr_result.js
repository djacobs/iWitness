IWitness.FlickrResult = Ember.Object.extend({
  isFlickr: true,
  latBinding: 'latitude',
  lngBinding: 'longitude',

  timestamp: function() {
    return moment(this.get('datetaken'), 'YYYY-MM-DD hh:mm:ss').format('M/D h:mma');
  }.property('datetaken'),

  uploadTimestamp: function() {
    return moment(parseInt(this.get('dateupload')) * 1000).format('M/D h:mma z');
  }.property('dateupload'),

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
