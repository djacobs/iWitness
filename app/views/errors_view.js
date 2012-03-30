IWitness.ErrorsView = Ember.View.extend({
  classNames:        ["error-bubble"],
  classNameBindings: ["isError"],

  isError: function() {
    return !!this.get("error");
  }.property("error")
});
