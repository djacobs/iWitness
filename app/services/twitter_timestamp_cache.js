var TwitterTimestampCache = {
  PREFIX: "twitter_timestamp_",

  storeTweet: function(id, m) {
    localStorage[this._key(m)] = id;
  },

  getClosestTweetId: function(m) {
    var endOfDay = moment(m).eodUTC();
    var startKeyTime = this._keyTime(m);
    var endKeyTime   = this._keyTime(endOfDay);

    for (var keyTime = startKeyTime; keyTime < endKeyTime; keyTime++) {
      var key = this.PREFIX + keyTime;
      if (localStorage[key]) return localStorage[key];
    }

    return null;
  },

  expire: function() {
    var expirationBoundary = this._keyTime(moment().subtract('days', 9));

    for (var key in localStorage) {
      if (this._isKey(key)){
        if(parseInt(key.slice(this.PREFIX.length)) < expirationBoundary) delete localStorage[key];
      }
    }
  },

  _key: function(m) {
    return this.PREFIX + this._keyTime(m);
  },

  _keyTime: function(m) {
    // use substr to cheaply round the time in steps of 1 min 40 sec
    return m.valueOf().toString().substr(0,8);
  },

  _isKey: function(key) {
    return key.substring(0,this.PREFIX.length) == this.PREFIX;
  }
}
