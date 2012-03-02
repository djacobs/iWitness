var TwitterCache = {
  storeTweet: function(id, m) {
    localStorage[this._key(m)] = id;
  },

  getClosestTweetId: function(m) {
    var endOfDay = moment(m).eodUTC();
    var startKey = this._key(m);
    var endKey   = this._key(endOfDay);

    for (var key = startKey; key < endKey; key++) {
      if (localStorage[key]) return localStorage[key];
    }

    return null;
  },

  expire: function() {
    var expirationBoundary = this._key(moment().subtract('days', 9));

    for (var key in localStorage) {
      if (key < expirationBoundary) delete localStorage[key];
    }
  },

  _key: function(m) {
    // use substr to cheaply round the time in steps of 1 min 40 sec
    return m.valueOf().toString().substr(0,8);
  }
}
