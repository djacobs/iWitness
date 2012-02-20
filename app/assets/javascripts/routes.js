IWitness.routes = {
  draw: function() {
    SC.routes.add('/search', this, this.search);
  },

  search: function(params) {
    params.center    = params.center.split(',');
    params.northEast = params.northEast.split(',');
    params.southWest = params.southWest.split(',');
    params.zoom      = parseInt(params.zoom);
    params.radius    = parseInt(params.radius);

    IWitness.searchCriteria.setProperties(params);

    IWitness.searchController.search();
  },

  visitSearch: function(criteria) {
    var props = criteria.getProperties('startDate', 'startTime', 'endDate', 'endTime',
                  'keyword', 'zoom', 'center', 'northEast', 'southWest', 'radius');
    SC.routes.set('location', _.extend(props, {route: '/search'}));
  }
}
