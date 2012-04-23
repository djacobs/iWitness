describe("ServiceMonitor", function(){
  var monitor, twitterSearch, content;

  beforeEach(function(){
    monitor = IWitness.ServiceMonitor.create();
    twitterSearch = {
      _hasMorePages: true,
      hasMorePages: function() { return this._hasMorePages; }
    };
  });

  describe('status', function(){
    describe("first page load", function(){
      it("starts with 'no results'", function(){
        expect(monitor.get('status')).toEqual("no results");
      });
    });

    describe("after some searches", function(){
      beforeEach(function(){
        monitor.set('search', twitterSearch);
      });

      it("starts with 'pending'", function(){
        expect(monitor.get('status')).toEqual("pending");
      });

      it("searching", function(){
        expect(monitor.get('status')).toEqual("pending");
        Ember.sendEvent(twitterSearch, 'fetch');
        expect(monitor.get('status')).toEqual("searching");
      });

      it("streaming", function(){
        expect(monitor.get('status')).toEqual("pending");
        Ember.sendEvent(twitterSearch, 'streaming');
        expect(monitor.get('status')).toEqual("streaming");
      });

      it("resetting", function(){
        expect(monitor.get('status')).toEqual("pending");
        monitor.reset();
        expect(monitor.get('status')).toEqual("pending");
        expect(Ember.hasListeners(twitterSearch, 'fetch')).toBeFalsy();
        expect(Ember.hasListeners(twitterSearch, 'data')).toBeFalsy();
        expect(Ember.hasListeners(twitterSearch, 'done')).toBeFalsy();
      });

      it("completed with no results", function(){
        expect(monitor.get('status')).toEqual("pending");
        Ember.sendEvent(twitterSearch, 'done');
        expect(monitor.get('status')).toEqual("no results");
        expect(monitor.get('hasData')).toBeFalsy();
      });

      it("completed after results have come in", function(){
        Ember.sendEvent(twitterSearch, 'data', 'tweets');
        Ember.sendEvent(twitterSearch, 'done');
        expect(monitor.get('status')).toEqual("completed");
        expect(monitor.get('hasData')).toBeTruthy();
      });
    });

  });


  describe("after search completes", function(){
    it("sets hasMorePages equal to search.hasMorePages", function(){
      monitor.set('search', twitterSearch);
      twitterSearch._hasMorePages = false;
      expect(monitor.get('hasMorePages')).toBeTruthy();
      Ember.sendEvent(twitterSearch, 'done');
      expect(monitor.get('hasMorePages')).toBeFalsy();
    });
  });
});
