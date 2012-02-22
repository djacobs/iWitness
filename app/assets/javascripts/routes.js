IWitness.routes = {
  draw: function() {
    SC.routes.add('/search/:keyword/:rawStart/:rawEnd/:useTimezone', this, this.search);
    SC.routes.add('/stream/:keyword', this, this.stream);
  },

  search: function(params) {
    params.center    = params.center.split(',');
    params.northEast = params.northEast.split(',');
    params.southWest = params.southWest.split(',');
    params.zoom      = parseInt(params.zoom);
    params.radius    = parseInt(params.radius);

    params.rawStart = moment(params.rawStart, "YYYY-MM-DDTHH:mm");
    params.rawEnd   = moment(params.rawEnd, "YYYY-MM-DDTHH:mm");

    IWitness.searchCriteria.setProperties(params);

    IWitness.searchController.search();
  },

  stream: function(params) {
    // do stuff
    console.log('streaming!', params);
  },

  visitSearch: function(criteria) {
    var props = criteria.getProperties('zoom', 'center', 'northEast', 'southWest', 'radius');
    var route = '/search' +
      '/' + criteria.get('keyword') +
      '/' + criteria.get('rawStart').format('YYYY-MM-DDTHH:mm') +
      '/' + criteria.get('rawEnd').format('YYYY-MM-DDTHH:mm') +
      '/' + criteria.get('useTimezone');
    SC.routes.set('location', _.extend(props, {route: route}));
  },

  visitStream: function(criteria) {
    var props = criteria.getProperties('zoom', 'center', 'northEast', 'southWest', 'radius');
    var route = '/stream' +
      '/' + criteria.get('keyword');
    SC.routes.set('location', _.extend(props, {route: route}));
  }
}
