IWitness.Result = Ember.Object.extend(Ember.Comparable, {
  avatarSrc:         null,
  title:             null,
  userUrl:           null,
  userNamePrimary:   null,
  userNameSecondary: null,
  postedMoment:      null,
  contentSrc:        null,
  contentText:       null,
  permalinkUrl:      null,
  permalinkText:     null,
  lat:               null,
  lng:               null,
  resultType:        null,

  serialize: function() {
    var origParams = this.get('originalParams');
    origParams.resultType = this.get('resultType');
    return JSON.stringify(origParams);
  },

  compare: function(a,b) {
    if (a.get('resultId') === b.get('resultId')){
      return 0;
    } else if (a.get("postedMoment").isBefore(b.get("postedMoment"))) {
      return 1;
    } else {
      return -1;
    }
  }

});
