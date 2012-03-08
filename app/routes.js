IWitness.routes = {
  draw: function() {
    SC.routes.add('/search/:keyword/:rawStart/:rawEnd/:useTimezone', this, this.search);
    SC.routes.add('/stream/:keyword', this, this.stream);
  },

  search: function(params) {
    Analytics.startSession(false);

    params.rawStart = moment(params.rawStart, "YYYY-MM-DDTHH:mm");
    params.rawEnd   = moment(params.rawEnd, "YYYY-MM-DDTHH:mm");
    this._setSearchParams(params);
    IWitness.searchController.search(IWitness.criteria.getParams());
  },

  stream: function(params) {
    Analytics.startSession(true);

    params.stream = true;
    this._setSearchParams(params);
    IWitness.searchController.search(IWitness.criteria.getParams());
  },

  visitSearch: function(criteria) {
    var props = criteria.getProperties('zoom', 'center', 'northEast', 'southWest', 'radius', 'address');
    var route = '/search' +
      '/' + criteria.get('keyword') +
      '/' + criteria.get('rawStart').format('YYYY-MM-DDTHH:mm') +
      '/' + criteria.get('rawEnd').format('YYYY-MM-DDTHH:mm') +
      '/' + criteria.get('useTimezone');
    SC.routes.set('location', _.extend(props, {route: route}));
  },

  visitStream: function(criteria) {
    var props = criteria.getProperties('zoom', 'center', 'northEast', 'southWest', 'radius', 'address');
    var route = '/stream' +
      '/' + criteria.get('keyword');
    SC.routes.set('location', _.extend(props, {route: route}));
  },

  _setSearchParams: function(params){
    params.center    = params.center.split(',');
    params.northEast = params.northEast.split(',');
    params.southWest = params.southWest.split(',');
    params.zoom      = parseInt(params.zoom);
    params.radius    = parseInt(params.radius);
    IWitness.criteria.setProperties(params);
  }
}
