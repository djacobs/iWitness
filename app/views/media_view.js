IWitness.MediaView = Ember.View.extend({
  templateName: "media_template",

  isIFrame: function(){
    return this.getPath("media.serviceType") == 'video';
  }.property("media.serviceType"),

  didInsertElement: function() {
    this.$('img').on('error', function() {
      $(this).closest('a').remove();
    });
  }
});
