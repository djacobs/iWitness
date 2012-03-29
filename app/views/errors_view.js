IWitness.ErrorsView = Ember.View.extend({
  classNames:        ["error-bubble"],
  classNameBindings: ["isError"],

  isError: function() {
    console.log("isError: ", !!this.get("error"));
    return !!this.get("error");
  }.property("error")
});
