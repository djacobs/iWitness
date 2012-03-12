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
