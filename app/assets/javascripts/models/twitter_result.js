IWitness.TwitterResult = Ember.Object.extend({
  timestamp: function() {
    return moment(this.get('createdAt')).format('h:mma');
  }.property('createdAt'),

  fromUserUrl: function() {
    return "http://twitter.com/#!/" + this.get('fromUser');
  }.property('fromUser')
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
