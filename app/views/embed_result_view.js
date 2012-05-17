IWitness.EmbedResultView = Ember.View.extend(IWitness.PostedDateTime, IWitness.LinkifiedContent, {
  templateName: "embed_result_template",
  modelBinding: "content",
  classAttribute: function() {
    return ["iwitness_item", this.getPath("model.resultType")].join(" ");
  }.property()
});
