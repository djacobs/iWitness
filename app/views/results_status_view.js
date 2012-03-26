IWitness.ResultsStatusView = Ember.View.extend({
  templateName: 'results_status_template',
  criteriaBinding: 'IWitness.criteriaController.content',

  status: function() {
    if (this.getPath('criteria.isValid')) {
      if (['isFlickrSearching', 'isTwitterSearching'].every(this.getPath, this)) {
        return 'Scanning';
      } else {
        return 'Finished';
      }
    } else {
      return "Something's Wrong";
    }
  }.property('isFlickrSearching', 'isTwitterSearching', 'criteria.isValid'),

  statusClass: function() {
    var statusClass = this.get('status').replace(' ','_').replace("'",'').toLowerCase();
    return 'status ' + statusClass;
  }.property('status'),

  isFlickrSearching: function(){
    return this._isSearching('flickr');
  }.property('IWitness.searchController.monitors.flickr.status', 'criteria.isValid'),

  isTwitterSearching: function(){
    return this._isSearching('twitter');
  }.property('IWitness.searchController.monitors.twitter.status', 'criteria.isValid'),

  _isSearching: function(service){
    var status = IWitness.searchController.getPath('monitors.'+service+'.status')
    return status == 'pending';
  },

  showStarred: function(e) {
    IWitness.currentViewController.set('currentView', 'starred_results');
  }
});
