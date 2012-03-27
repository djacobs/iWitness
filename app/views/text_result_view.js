IWitness.TextResultView = Ember.View.extend({
  templateName:      'text_result_template',

  isTwitter: function(){
    return this.getPath('model.resultType') == 'twitter';
  }.property('model.resultType'),

  isFlickr: function(){
    return this.getPath('model.resultType') == 'flickr';
  }.property('model.resultType'),

  postedDate: function() {
    var m = this.getPath('model.postedMoment');
    if (IWitness.criteria.get('useLocalTime')) {
      return m.format('MM/DD/YY');
    } else {
      var offset = IWitness.criteria.get('mapTimezoneOffset');
      return m.formatWithTimezoneOffset(offset, 'MM/DD/YY');
    }
  }.property('model.postedMoment', 'IWitness.criteria.useLocalTime'),

  postedTime: function() {
    var m = this.getPath('model.postedMoment');
    if (IWitness.criteria.get('useLocalTime')) {
      return m.format('h:mm a');
    } else {
      var offset = IWitness.criteria.get('mapTimezoneOffset');
      return m.formatWithTimezoneOffset(offset, 'h:mm a');
    }
  }.property('model.postedMoment', 'IWitness.criteria.useLocalTime')

});
