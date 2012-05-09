Ember.Handlebars.registerHelper('linkify', function(property, options) {
  var linkRegex = /(((http|https):\/\/)[\w-]+\.([\w-]+\.?)+|([\w-]+\.){2,}\w+)(:[0-9]+)?[\w#!:.?+=&%@!\-\/]*/g;
  var result = Ember.getPath(this, property);
  var match;
  var reCount = 0;
  var links = {};
  var placeholder;

  while (match = linkRegex.exec(result)) {
    reCount++;
    placeholder = "__iWitness_link_"+reCount+"__";
    links[placeholder] = match[0];
    result = result.replace(match[0], placeholder);
  }

  result = Handlebars.Utils.escapeExpression(result);

  _.each(_(links).keys(), function(key) {
    result = result.replace(key, '<a target="_blank" href="'+links[key]+'">'+links[key]+'</a>');
  })

  return new Handlebars.SafeString(result);
});

// source: https://gist.github.com/1563710

Ember.HandlebarsTransformView = Ember.View.extend(Ember.Metamorph, {
  rawValue: null,
  transformFunc: null,

  value: function(){
    var rawValue = this.get('rawValue'),
        transformFunc = this.get('transformFunc');
    return transformFunc(rawValue);
  }.property('rawValue', 'transformFunc').cacheable(),

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
