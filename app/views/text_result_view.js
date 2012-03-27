IWitness.TextResultView = Ember.View.extend(IWitness.PostedDateTime, {
  templateName: 'text_result_template',

  isTwitter: function(){
    return this.getPath('model.resultType') == 'twitter';
  }.property('model.resultType'),

  isFlickr: function(){
    return this.getPath('model.resultType') == 'flickr';
  }.property('model.resultType')

});
