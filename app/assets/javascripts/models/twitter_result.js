IWitness.TwitterResult = Ember.Object.extend({
  timestamp: function() {
    return moment(this.get('created_at')).format('h:mma');
  }.property('created_at')
});
