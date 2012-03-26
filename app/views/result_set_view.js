IWitness.ResultSetView = Ember.View.extend({
  templateName: 'result_set_template',
  isVisibleBinding: 'IWitness.currentViewController.showingSearchResults',

  didInsertElement: function(){
    Ember.addListener(IWitness.searchController, 'searchComplete', this, this._renderLoadMore);
  },

  timeline: _.debounce(function(){
    var prev, cur;
    $('#timeline').show();
    this.$(".item-wrapper").each(function(i, e){
      cur = $(e);
      if(prev && cur) {
        if (prev.data('posted-time') == cur.data('posted-time')) {
          prev.removeClass('last');
          cur.removeClass('first');
        } else {
          prev.addClass('last');
          cur.addClass('first');
        }
      } else {
        cur.addClass('first');
      }
      prev = cur;
    });
    // prev is now the very last item, which ends the timeline.
    if (prev) prev.addClass('last');

  }, 100).observes('IWitness.resultSetController.length'),


  _toggleLivestreamPausing: function(){
    if(IWitness.criteriaController.getPath('content.stream')){
      $(window).on('scroll', this._scrollPause() );
    } else {
      $(window).off('scroll', this._scrollPause() );
      this._unpause();
    }
  }.observes('IWitness.criteriaController.content.stream'),

  // wrap the debounced call in a function that binds 'this' to the current view.
  _scrollPause: function(){
    var self = this;
    return _.debounce(function(e){
      if($(window).scrollTop() > 100) {
        self._pause();
      } else {
        self._unpause();
      }
    }, 100);
  },

  _pause: function(){
    IWitness.hiddenItemsController.pause();
  },

  _unpause: function(){
    IWitness.hiddenItemsController.unpause();
    $('.item-wrapper.hidden').removeClass('hidden');
  },

  _renderLoadMore: function(){
    var self = this;
    $('.load-more').remove();

    _.defer(function() {
      if(IWitness.searchController.serviceHasMorePages('twitter')) {
        $row = self._loadMoreRow('twitter', 'Load More from Twitter');
        self.$('.twitter:last').after($row);
      } else {
        $row = self._finishedRow('No more Twitter results');
        self.$('.twitter:last').after($row);
      }

      if(IWitness.searchController.serviceHasMorePages('flickr')) {
        $row = self._loadMoreRow('flickr', 'Load More from Flickr');
        self.$('.flickr:last').after($row);
      } else {
        $row = self._finishedRow('No more Flickr results');
        self.$('.flickr:last').after($row);
      }
    });
  },

  _loadMoreRow: function(serviceType, buttonText) {
    $loadMoreLink = $('<a href="#" class="btn btn-info btn-large">').html(buttonText).click(function(e) {
      e.preventDefault();
      $('.load-more').remove();
      IWitness.searchController.getNextPageForService(serviceType);
    });
    return $('<div class="load-more">').append($loadMoreLink);
  },

  _finishedRow: function(buttonText) {
    $loadMoreLink = $('<a href="#" class="btn btn-inverse btn-large">').html(buttonText).click(function(e) {
      e.preventDefault();
    });
    return $('<div class="load-more">').append($loadMoreLink);
  }
});
