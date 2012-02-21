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

  compare: function(a,b) {
    if (a.get("postedMoment").isBefore(b.get("postedMoment"))) {
      return 1;
    } else {
      return -1;
    }
  }
});
