IWitness.routes = Ember.Object.create({
  firstLoad: true,
  criteriaBinding: "IWitness.criteriaController.content",

  draw: function() {
    SC.routes.add('', this, this.findLocation);
    SC.routes.add('/search/:keyword/:rawStart/:rawEnd/:useTimezone', this, this.search);
    SC.routes.add('/stream/:keyword', this, this.stream);
  },

  findLocation: function(params) {
    Analytics.extendSession('search');
    if(this.get('firstLoad')) {
      this.set('firstLoad', false);
      this.get("criteria").setDefaultCenter();
    }
  },

  search: function(params) {
    Analytics.extendSession('search');
    if(this.get('firstLoad')) {
      this.set('firstLoad', false);
      params.rawStart = moment(params.rawStart, "YYYY-MM-DDTHH:mm");
      params.rawEnd   = moment(params.rawEnd, "YYYY-MM-DDTHH:mm");
      this._setSearchParams(params);
    }
  },

  stream: function(params) {
    Analytics.extendSession('stream');

    if(this.get('firstLoad')) {
      this.set('firstLoad', false);
      params.stream = true;
      this._setSearchParams(params);
    }
  },

  location: function() {
    if(this.getPath('criteria.isValid')) {
      this._setUrl();
    }
  }.observes('criteria.zoom', 'criteria.center', 'criteria.northEast', 'criteria.southWest', 'criteria.radius', 'criteria.address',
             'criteria.stream', 'criteria.keyword', 'criteria.rawStart', 'criteria.rawEnd', 'criteria.useLocalTime'),

 _setUrl: _.debounce( function() {
    var route;
    var criteria = this.get('criteria');
    var props = criteria.getProperties('zoom', 'center', 'northEast', 'southWest', 'radius', 'address');

    if(criteria.get('stream')) {
      route = '/stream/' + criteria.get('keyword');
    } else {
      route = '/search/' + criteria.get('keyword') +
                     '/' + criteria.get('rawStart').format('YYYY-MM-DDTHH:mm') +
                     '/' + criteria.get('rawEnd').format('YYYY-MM-DDTHH:mm') +
                     '/' + (criteria.get('useLocalTime') ? 'local' : 'map');
    }

    SC.routes.set('location', _.extend(props, {route: route}));
 }, IWitness.config.searchDelay),

  _setSearchParams: function(params){
    params.center       = params.center.split(',');
    params.northEast    = params.northEast.split(',');
    params.southWest    = params.southWest.split(',');
    params.zoom         = parseInt(params.zoom);
    params.radius       = parseInt(params.radius);
    params.useLocalTime = (params.useTimezone == 'local');
    this.get("criteria").setProperties(params);
  }

});
