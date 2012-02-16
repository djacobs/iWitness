IWitness.TwitterResult = Ember.Object.extend({
  isTwitter: true,

  timestamp: function() {
    return moment(this.get('createdAt')).format('h:mma');
  }.property('createdAt'),

  fromUserUrl: function() {
    return "http://twitter.com/#!/" + this.get('fromUser');
  }.property('fromUser'),

  permalinkUrl: function() {
    return this.get('fromUserUrl') + '/status/' + this.get('idStr');
  }.property(),

  coordinates: function() {
    return this.getPath('geo.coordinates') || [];
  }.property('geo').cacheable(),

  lat: function() {
    return this.get('coordinates')[0];
  }.property('coordinates').cacheable(),

  lng: function() {
    return this.get('coordinates')[1];
  }.property('coordinates').cacheable()
});

IWitness.TwitterResult.import = function(obj) {
  var camelCased = {};
  var newKey;

  for (var k in obj) {
    newKey = k.replace(/_(\w)/g, function(match, char) {
      return char.toUpperCase();
    });
    camelCased[newKey] = obj[k];
  }

  return IWitness.TwitterResult.create(camelCased);
};
