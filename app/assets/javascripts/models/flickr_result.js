IWitness.FlickrResult = Ember.Object.extend({
  permalinkText:          'flickr',
  latBinding:             'latitude',
  lngBinding:             'longitude',
  avatarSrcBinding:       'profilePicUrl',
  userNamePrimaryBinding: 'ownername',
  contentSrcBinding:      'urlS',
  contentTextBinding:     'description._content',

  postedMoment: function() {
    return moment(this.get('datetaken'), 'YYYY-MM-DD hh:mm:ss');
  }.property('datetaken'),

  userUrl: function(){
    return "http://www.flickr.com/photos/" + this.get('owner');
  }.property('owner'),

  profilePicUrl: function(){
    return "http://flickr.com/buddyicons/" + this.get('owner') + ".jpg";
  }.property('owner'),

  permalinkUrl: function() {
    return "http://flickr.com/photos/" + this.get('owner') + "/" + this.get('id');
  }.property('owner', 'id')
});
