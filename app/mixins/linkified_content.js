IWitness.LinkifiedContent = Ember.Mixin.create({
  contentText: function() {
    var linkRegex = /(((http|https):\/\/)[\w-]+\.([\w-]+\.?)+|([\w-]+\.){2,}\w+)(:[0-9]+)?[\w#!:.?+=&%@!\-\/]*/g;
    var result = this.getPath("model.contentText");
    var match;
    var reCount = 0;
    var links = {};
    var placeholder;

    var media_links = _.map(this.getPath('model.media.displayable'), function(media){
      return media.get('expanded_url');
    });

    // links
    while (match = linkRegex.exec(result)) {
      reCount++;
      placeholder = "__iWitness_link_"+reCount+"__";
      links[placeholder] = match[0];
      result = result.replace(match[0], placeholder);
    }

    result = Handlebars.Utils.escapeExpression(result);

    _.each(_(links).keys(), function(key) {
      // we want to remove inlined media links from the text content rather than linkifying it.
      if(_.indexOf(media_links, links[key]) > -1) {
        result = result.replace(key, '');
      } else {
        result = result.replace(key, '<a target="_blank" href="'+links[key]+'">'+links[key]+'</a>');
      }
    });

    if (this.getPath("model.isTweet")) {
      // mentions
      result = result.replace(/(^|\W)@(\w+)/g, "$1<a href=\"http://twitter.com/$2\" target=\"_blank\">@$2</a>")

      // hash tags
      result = result.replace(/(^|\s)#(\w+)/g, "$1<a href=\"http://twitter.com/search?q=%23$2\" target=\"_blank\">#$2</a>");
    }

    return new Handlebars.SafeString(result);
  }.property("model.contentText")
});
