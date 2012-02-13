describe("Moment", function(){
  var m;
  beforeEach(function() {
    m = moment("1/1/2012 12:00 PM");
  });

  describe("formatUTC", function(){
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

  describe("isAfter", function(){
    it("returns true when later than the moment passed in", function() {
      var earlyMoment = moment('1/1/2012 9:00 AM');
      expect(m.isAfter(earlyMoment)).toBeTruthy();
    });

    it("returns false when earlier than the moment passed in", function() {
      var lateMoment = moment('1/1/2012 5:00 PM');
      expect(m.isAfter(lateMoment)).toBeFalsy();
    });

    it("returns false when the same as the moment passed in", function() {
      var sameMoment = moment('1/1/2012 12:00 PM');
      expect(m.isAfter(sameMoment)).toBeFalsy();
    });
  });

  describe("isBefore", function(){
    it("returns true when earlier than the moment passed in", function() {
      var lateMoment = moment('1/1/2012 5:00 PM');
      expect(m.isBefore(lateMoment)).toBeTruthy();
    });

    it("returns false when later than the moment passed in", function() {
      var earlyMoment = moment('1/1/2012 9:00 AM');
      expect(m.isBefore(earlyMoment)).toBeFalsy();
    });

    it("returns false when the same as the moment passed in", function() {
      var sameMoment = moment('1/1/2012 12:00 PM');
      expect(m.isBefore(sameMoment)).toBeFalsy();
    });
  });
});
