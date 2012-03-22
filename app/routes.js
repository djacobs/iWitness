IWitness.routes = {
  draw: function() {
    SC.routes.add('/search/:keyword/:rawStart/:rawEnd/:useTimezone', this, this.search);
    SC.routes.add('/stream/:keyword', this, this.stream);
  },

  search: function(params) {
    Analytics.extendSession('search');

    params.rawStart = moment(params.rawStart, "YYYY-MM-DDTHH:mm");
    params.rawEnd   = moment(params.rawEnd, "YYYY-MM-DDTHH:mm");
    this._setSearchParams(params);
    this._executeSearch();
  },

  stream: function(params) {
    Analytics.extendSession('stream');

    params.stream = true;
    this._setSearchParams(params);
    this._executeSearch();
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
  },

  _executeSearch: function() {
    if (IWitness.spaceTime.get("isLoaded")) {
      IWitness.searchController.search(IWitness.criteria.getParams());
    } else {
      setTimeout(function() {
        IWitness.searchController.search(IWitness.criteria.getParams());
      } , 10);
    }
  }
}
