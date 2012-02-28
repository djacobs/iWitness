IWitness.FlickrResult = IWitness.Result.extend({
  resultType:             'flickr',
  permalinkText:          'flickr',
  latBinding:             'latitude',
  lngBinding:             'longitude',
  avatarSrcBinding:       'profilePicUrl',
  userNamePrimaryBinding: 'ownername',
  contentSrcBinding:      'urlS',
  contentTextBinding:     'description._content',

  resultId: function(){
    return this.get('resultType') +'-'+ this.get('id');
  }.property('id'),

  postedMoment: function() {
    var offset   = IWitness.criteria.get('mapTimezoneOffset') || 0;
    var timezone = '+0000';

    if (offset > 9) {
      timezone = '+' + Math.abs(offset) + '00';
    } else if (offset > 0) {
      timezone = '+0' + Math.abs(offset) + '00';
    } else if (offset < -9) {
      timezone = '-' + Math.abs(offset) + '00';
    } else if (offset < 0) {
      timezone = '-0' + Math.abs(offset) + '00';
    }

    var datetaken = this.get('datetaken') + ' ' + timezone;
    return moment(datetaken, 'YYYY-MM-DD HH:mm:ss Z');
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
