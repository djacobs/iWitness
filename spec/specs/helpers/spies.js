var spyOnProperties = function(obj, props) {
  var spy = spyOn(obj, 'get');

  spy.andCallFake(function(keyName) {
    if (keyName in props) return props[keyName];
    else return spy.originalValue.apply(this, arguments);
  });
}
