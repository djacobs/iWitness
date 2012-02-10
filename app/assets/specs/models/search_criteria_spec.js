describe("SearchCriteria", function() {
  var subject, validProps;

  beforeEach(function() {
    subject = IWitness.searchCriteria;
    subject.setProperties({center: null, northEast: null});

    validProps = {
      startDate: '1/1/2012',
      startTime: '9:00 AM',
      endDate:   '1/1/2012',
      endTime:   '10:00 AM'
    };
  });

  describe("radius", function() {
    it("is a whole number in kilometers, rounded up", function() {
      subject.setProperties({center: [], northEast: []});

      var stub = {length: function() { return 9100 }};
      spyOn(Map, 'Line').andReturn(stub);

      expect(subject.get('radius')).toEqual(10);
    });

    it("is 0 when center or northEast are not set", function() {
      expect(subject.get('radius')).toEqual(0);
    });
  });

  describe("errors", function() {
    it("returns an empty array for valid criteria", function() {
      subject.setProperties(validProps);
      expect(subject.get('errors')).toEqual([]);
    });

    it("includes an error if startDate is empty", function() {
      subject.setProperties(_.extend(validProps, {startDate: ''}));
      expect(subject.get('errors').length).toEqual(1);
      expect(subject.get('errors')[0]).toMatch(/start date/i);
    });

    it("includes an error if startTime is empty", function() {
      subject.setProperties(_.extend(validProps, {startTime: ''}));
      expect(subject.get('errors').length).toEqual(1);
      expect(subject.get('errors')[0]).toMatch(/start date/i);
    });

    it("includes an error if endDate is empty", function() {
      subject.setProperties(_.extend(validProps, {endDate: ''}));
      expect(subject.get('errors').length).toEqual(1);
      expect(subject.get('errors')[0]).toMatch(/end date/i);
    });

    it("includes an error if endTime is empty", function() {
      subject.setProperties(_.extend(validProps, {endTime: ''}));
      expect(subject.get('errors').length).toEqual(1);
      expect(subject.get('errors')[0]).toMatch(/end date/i);
    });

    it("includes an error if the start comes before the end", function() {
      subject.setProperties(_.extend(validProps, {endTime: '8:00 AM'}));
      expect(subject.get('errors').length).toEqual(1);
      expect(subject.get('errors')[0]).toMatch(/before/i);
    });

    it("includes an error if the radius is more than 75km", function() {
      subject.setProperties(validProps);
      spyOnProperties(subject, {radius: 76});

      expect(subject.get('errors').length).toEqual(1);
      expect(subject.get('errors')[0]).toMatch(/zoom/i);
    });
  });
});

