window.IWitness = Ember.Application.create({
  ready: function() {
    _.delay(function(){
      $("#keyword").val("glass").trigger('change');
      $("#start_date").val("2/14/2012").trigger('change');
      $("#start_time").val("6:00 PM").trigger('change');
      $("#end_date").val("2/14/2012").trigger('change');
      $("#end_time").val("7:00 PM").trigger('change');
    }, 500);

    // SC.routes.add('/search/:startDate/:startTime/:endDate/:endTime/:keyword', this, this.search);
    SC.routes.add('/search', this, this.search);
  },

  search: function(params) {
    params.center    = params.center.split(',');
    params.northEast = params.northEast.split(',');
    params.southWest = params.southWest.split(',');
    params.zoom      = parseInt(params.zoom);
    params.radius    = parseInt(params.radius);

    IWitness.searchCriteria.setProperties(params);

    // set the flickr key in the params

    console.log('searching ', params);

    IWitness.searchController.search();
  }
});

IWitness.log = _.bind(Ember.Logger.log, Ember.Logger);
