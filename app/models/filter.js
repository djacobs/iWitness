IWitness.filter = Ember.Object.create({
  availableMediaTypes: ['text', 'picture', 'video'].map(function(type) {
    return Ember.Object.create({type: type, active: true});
  }),

  mediaTypes: function() {
    return this.get('availableMediaTypes').filterProperty('active')
                                          .mapProperty('type');
  }.property('availableMediaTypes.@each').cacheable()
});
