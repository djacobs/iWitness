IWitness.ResultsStatusView = Ember.View.extend({
  templateName: 'results_status_template',
  criteriaBinding: 'IWitness.criteriaController.content',
  showingPopover: false,

  status: function() {
    if (!this.getPath('criteria.isValid')) { return "Something's wrong"; }
    if(this.getPath('criteria.stream')) {
      return 'Streaming';
    } else if (['isFlickrSearching', 'isTwitterSearching'].some(this.getPath, this)) {
      return 'Scanning';
    } else {
      return 'Finished';
    }
  }.property('isFlickrSearching', 'isTwitterSearching', 'criteria.isValid'),

  statusClass: function() {
    var statusClass = this.get('status').replace(' ','_').replace("'",'').toLowerCase();
    return 'status ' + statusClass;
  }.property('status'),

  showPopover: function(e) {
    this.set('showingPopover', true);
  },

  isFlickrSearching: function(){
    return this._isSearching('flickr');
  }.property('IWitness.searchController.monitors.flickr.status', 'criteria.isValid'),

  isTwitterSearching: function(){
    return this._isSearching('twitter');
  }.property('IWitness.searchController.monitors.twitter.status', 'criteria.isValid'),

  _isSearching: function(service){
    var status = IWitness.searchController.getPath('monitors.'+service+'.status');
    return status == 'pending' || status == 'streaming' || status == 'searching';
  },

  showSaved: function(e) {
    IWitness.currentViewController.set('currentView', 'saved_results');
  }
});
