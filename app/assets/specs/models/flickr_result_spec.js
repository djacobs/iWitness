describe("IWitness.FlickrResult", function() {
  var subject;

  beforeEach(function() {
    subject = new IWitness.FlickrResult();
  });

  describe("postedMoment", function() {
    it("parses the datetaken using the timezone from the map (positive offset)", function() {
      var dateTaken = moment("02/12/12 11:00 +0000");
      var dateTakenJSTString = '2012-02-12 20:00:00';
      spyOnProperties(IWitness.searchCriteria, {mapTimezoneOffset: 9});
      subject.set('datetaken', dateTakenJSTString);
      expect(subject.get('postedMoment').toString()).toEqual(dateTaken.toString());
    });

    it("parses the datetaken using the timezone from the map (negative offset)", function() {
      var dateTaken = moment("02/12/12 17:00 +0000");
      var dateTakenPSTString = '2012-02-12 09:00:00';
      spyOnProperties(IWitness.searchCriteria, {mapTimezoneOffset: -8});
      subject.set('datetaken', dateTakenPSTString);
      console.log('postedMoment', subject.get('postedMoment'));
      expect(subject.get('postedMoment').toString()).toEqual(dateTaken.toString());
    });
  });
});
