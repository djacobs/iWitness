IWitness.MediaView = Ember.View.extend({
  templateName: "media_template",

  isIFrame: function(){
    return this.getPath("media.tagType") == 'iframe';
  }.property("media.tagType"),

  didInsertElement: function() {
    this.$('img').on('error', function() {
      $(this).closest('a').remove();
    });
  }
});
