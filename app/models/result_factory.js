IWitness.resultFactory = {
  create: function(type, obj) {
    var params     = this._camelCase(obj);
    var resultType = this._resultTypes[type];

    var emberObj = IWitness[resultType].create(params);
    emberObj.set('originalParams', params);
    return emberObj;
  },

  _resultTypes: {
    flickr: 'FlickrResult',
    twitter: 'TwitterResult'
  },

  _camelCase: function(params) {
    var camelCased = {};

    for (var k in params) {
      if (params.hasOwnProperty(k)) {
        camelCased[k.camelize()] = params[k];
      }
    }

    return camelCased;
  }
}
