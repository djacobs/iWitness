describe('IWitness.URLExpander', function() {
  describe('#expand', function() {
    it("expands urls based on the urlData passed in", function() {
      var rawText = "here is a short link http://url.com/short";
      var urlData = [{url: "http://url.com/short", expanded_url: "http://realurl.com/long"}];
      var expandedText = "here is a short link http://realurl.com/long";

      expect(IWitness.URLExpander.expand(rawText, urlData)).toEqual(expandedText);
    });

    it("does not modify text without urls", function() {
      var rawText = "here is a short post";
      var urlData = [];

      expect(IWitness.URLExpander.expand(rawText, urlData)).toEqual(rawText);
    });
  });
});
