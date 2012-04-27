IWitness.MediaView = Ember.View.extend({
  templateName: "media_template",

  isIFrame: function(){
    return this.get("tagType") == 'iframe';
  }.property("tagType")
});
