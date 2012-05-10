IWitness.VisibilityMonitor = Ember.Object.extend({
  shownOnce: false,

  isVisible: function(){
    if (this.get("isHiddenByScroll")) return false;

    var matchingFilters = _.intersection(this.getPath('result.mediaTypes'), IWitness.filter.get('mediaTypes'));
    return matchingFilters.length > 0;
  }.property("IWitness.filter.mediaTypes.@each", "result.mediaTypes", "isHiddenByScroll"),

  // scrolling down the list of results in live streaming mode
  // causes new items to be invisible until the user scrolls back to
  // the top of the list. If this monitor is created during a period
  // when it is "paused" then this result should be hidden
  isHiddenByScroll: function(){
    if (this.get("shownOnce")) return false;
    if (!IWitness.hiddenItemsController.get('paused')) this.set("shownOnce", true);
    return IWitness.hiddenItemsController.get('paused');
  }.property("IWitness.hiddenItemsController.paused")

});
