IWitness.TwitterResult = IWitness.Result.extend({
  resultType:             'twitter',
  permalinkText:          'twitter',
  avatarSrcBinding:       'profileImageUrl',
  userNamePrimaryBinding: 'fromUserName',
  contentTextBinding:     'text',

  resultId: function(){
    return this.get('resultType') +'-'+ this.get('idStr');
  }.property('idStr'),

  userNameSecondary: function() {
    return '@' + this.get('fromUser');
  }.property('fromUser'),

  postedMoment: function() {
    return moment(this.get('createdAt'));
  }.property('createdAt'),

  userUrl: function() {
    return "http://twitter.com/#!/" + this.get('fromUser');
  }.property('fromUser'),

  permalinkUrl: function() {
    return this.get('userUrl') + '/status/' + this.get('idStr');
  }.property(),

  coordinates: function() {
    return this.getPath('geo.coordinates') || [];
  }.property('geo').cacheable(),

  lat: function() {
    return this.get('coordinates')[0];
  }.property('coordinates').cacheable(),

  lng: function() {
    return this.get('coordinates')[1];
  }.property('coordinates').cacheable(),

  contentSrc: function() {
    return this.get("media").mediaUrl;
  }.property("media"),

  contentLink: function(){
    return this.get("media").url;
  }.property("media"),

  media: function(){
    var entities = this.get("entities"); // returns a normal JS object
    var url, match;

    // twitter pics show up in entities.media
    if (entities && entities.media) {
      url = _(entities.media).chain().filter(function(item) {
        return item.type == "photo";
      }).first().value();
      if (url){
        return new Media(url);
      }
    }

    // other links show up in entities.urls
    if (entities && entities.urls.length) {
      return new Media(entities.urls[0]);
    }

    return {};
  }.property("entities").cacheable(),

  fetchEmbed: function(){
    var self = this;
    var id   = this.getPath('idStr');

    $.getJSON("https://api.twitter.com/1/statuses/oembed.json?id="+id+"&align=center&callback=?", {}, function(res) {
      self.set('embedHtml', res.html);
    });
  }

});
