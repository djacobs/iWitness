IWitness.SavedHeaderView = Ember.View.extend({
  templateName: 'saved_header_template',

  switchToResults: function(){
    IWitness.currentViewController.set('currentView', 'search_results');
  },

  flagState: function() {
    return IWitness.savedSetController.everyProperty("flagged", true) ? "Unflag all" : "Flag all";
  }.property("IWitness.savedSetController.@each.flagged"),

  flagAll: function() {
    var saved = IWitness.savedSetController;
    if (saved.everyProperty("flagged", true)) {
      saved.setEach('flagged', false);
    } else {
      saved.setEach('flagged', true);
    }
  },

  clearSaved: function(){
    IWitness.savedSetController.clear();
  }
});
