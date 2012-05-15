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
  flagged:           false,

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
  },

  staticMapUrl: function() {
    return "http://maps.googleapis.com/maps/api/staticmap"+
      "?markers=" + this.get("lat") + "," + this.get("lng") +
      "&zoom=15" +
      "&size=246x233" +
      "&maptype=roadmap" +
      "&sensor=false" +
      "&" + Map.StaticStyle;
  }.property("lat", "lng")
});
