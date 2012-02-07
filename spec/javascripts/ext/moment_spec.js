describe("Moment", function(){
  describe("formatUTC", function(){
    var m;
    beforeEach(function() {
      m = moment("1/1/2012 12:00");
    });

    it("represents a time in its UTC equivilant", function(){
      expect(m.formatUTC('hh:mm')).toEqual('05:00')
    });

    it("does not mutate the time", function(){
      m.formatUTC('MM/DD');
      expect(m.diff(moment("1/1/2012 12:00"))).toEqual(0);
    });

    it("throws an error if timezone is specified in the format string", function(){
      expect(function() { m.formatUTC('hh:mm ZZ') }).toThrow();
    });

    it("did not extend function prototype", function(){
      expect((function(){}).formatUTC).not.toEqual(m.formatUTC);
    });
  });
});
