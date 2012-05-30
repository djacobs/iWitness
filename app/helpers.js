// source: https://gist.github.com/1563710

Ember.HandlebarsTransformView = Ember.View.extend(Ember.Metamorph, {
  rawValue: null,
  transformFunc: null,

  value: function(){
    var rawValue = this.get('rawValue'),
        transformFunc = this.get('transformFunc');
    return transformFunc(rawValue);
  }.property('rawValue', 'transformFunc'),

  render: function(buffer) {
    var value = this.get('value');
    if (value) { buffer.push(value); }
  },

  needsRerender: function() {
    this.rerender();
  }.observes('value')
});

Ember.HandlebarsTransformView.helper = function(context, property, transformFunc, options) {
  options.hash = {
    rawValueBinding: property,
    transformFunc:   transformFunc
  };
  return Ember.Handlebars.ViewHelper.helper(context, Ember.HandlebarsTransformView, options);
};

Ember.Handlebars.registerHelper('format', function(property, options) {
  var format = options.hash.format;
  var transformFunc = function(value) {
    return (value && value.format && format) ? value.format(format) : value;
  };
  return Ember.HandlebarsTransformView.helper(this, property, transformFunc, options);
});
