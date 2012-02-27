IWitness.resultSetView = Ember.View.extend({
  templateName: 'result_set_template',

  didInsertElement: function(){
    Ember.addListener(IWitness.searchController, 'searchComplete', this, this._renderLoadMore);
  },

  _renderLoadMore: function(){
    self = this;
    $('.load-more').remove();

    _.defer(function() {
      if(IWitness.searchController.serviceHasMorePages('twitter')) {
        $row = self._loadMoreRow('twitter', 'Load More from Twitter');
        $('tr.twitter:last').after($row);
      }

      if(IWitness.searchController.serviceHasMorePages('flickr')) {
        $row = self._loadMoreRow('flickr', 'Load More from Flickr');
        $('tr.flickr:last').after($row);
      }
    });
  },

  _loadMoreRow: function(serviceType, buttonText) {
    $loadMoreLink = $('<a href="#" class="btn btn-info btn-large">').html(buttonText).click(function(e) {
      e.preventDefault();
      $('.load-more').remove();
      IWitness.searchController.getNextPageForService(serviceType);
    });
    return $('<tr class="load-more">').append($('<td colspan="2">').append($loadMoreLink));
  }
});
