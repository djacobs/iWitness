IWitness.MediaCollection = Ember.ArrayProxy.extend({
  displayable: function(){
    return this.filterProperty("canDisplay");
  }.property("@each")
});
