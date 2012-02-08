IWitness.TwitterResult = Ember.Object.extend({
  timestamp: function() {
    return moment(this.get('created_at')).format('h:mma');
  }.property('created_at'),

  from_user_url: function() {
    return "http://twitter.com/#!/" + this.get('from_user');
  }.property('from_user')

});
