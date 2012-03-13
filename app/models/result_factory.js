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
    var newKey;

    for (var k in params) {
      newKey = k.replace(/_(\w)/g, function(match, char) {
        return char.toUpperCase();
      });
      camelCased[newKey] = params[k];
    }

    return camelCased;
  }
}
