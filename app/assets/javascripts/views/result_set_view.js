IWitness.resultSetView = Ember.View.extend({
  templateName: 'result_set_template',

  didInsertElement: function(){
    Ember.addListener(IWitness.searchController, 'searchComplete', this, this._renderLoadMore);
  },

  _renderLoadMore: function(){
    $('.load-more').remove();
    console.log('calling callbacks!!!@#@!#!@#!@#');
    _.defer(function() {
      if(IWitness.searchController.serviceHasMorePages('twitter')) {
        console.log($('tr.twitter').length, 'tweets');
        $('tr.twitter:last').after("<tr class='load-more'><td></td><td> LOAD MOAR </td></tr>");
      }
      if(IWitness.searchController.serviceHasMorePages('flickr')) {
        console.log($('tr.flickr').length, 'flicks');
        $('tr.flickr:last').after("<tr class='load-more'><td></td><td> LOAD MOAR </td></tr>");
      }
    });
  }
});
