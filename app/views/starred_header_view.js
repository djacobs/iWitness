IWitness.StarredHeaderView = Ember.View.extend({
  templateName: 'starred_header_template',

  switchToResults: function(){
    IWitness.currentViewController.set('currentView', 'search_results');
  },

  flagState: function() {
    return IWitness.starredSetController.everyProperty("flagged", true) ? "Unflag all" : "Flag all";
  }.property("IWitness.starredSetController.@each.flagged"),

  flagAll: function() {
    var starred = IWitness.starredSetController;
    if (starred.everyProperty("flagged", true)) {
      starred.setEach('flagged', false);
    } else {
      starred.setEach('flagged', true);
    }
  },

  clearStarred: function(){
    IWitness.starredSetController.clear();
  }
});
