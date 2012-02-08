Ember.Handlebars.registerHelper('linkify', function(property, options) {
  var linkRegex = /(((http|https):\/\/)[\w-]+\.([\w-]+\.?)+|([\w-]+\.){2,}\w+)(:[0-9]+)?[\w#!:.?+=&%@!\-\/]*/g;
  var result = Ember.getPath(this, property);

  result = Handlebars.Utils.escapeExpression(result);
  result = result.replace(linkRegex, '<a target="_blank" href="$&">$&</a>');

  return new Handlebars.SafeString(result);
});
