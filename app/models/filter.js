IWitness.filter = Ember.Object.create({
  availableMediaTypes: ['text', 'picture', 'video'].map(function(type) {
    return Ember.Object.create({type: type, active: true});
  }),

  availableServices: ['flickr', 'twitter'].map(function(type) {
    return Ember.Object.create({type: type, active: true});
  }),

  mediaTypes: function() {
    return this.get('availableMediaTypes').filterProperty('active').mapProperty('type');
  }.property('availableMediaTypes.@each.active'),

  services: function() {
    return this.get('availableServices').filterProperty('active').mapProperty('type');
  }.property('availableServices.@each.active'),

  shouldDisplay: function(result) {
    if (_.include(this.get('services'), result.get('resultType'))) {
      return _.intersection(result.get('mediaTypes'), this.get('mediaTypes')).length > 0;
    } else {
      return false;
    }
  }
});
