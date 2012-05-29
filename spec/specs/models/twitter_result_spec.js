describe("TwitterResult", function() {
  var result, entities;

  describe("media", function() {
    beforeEach(function() {
      entities = {urls: [], media: []};
    });

    it("contains a TwitterHostedMedia object for each entities.media", function(){
      entities.media.push({media_url: "https://p.twimg.com/AnSXE5FCEAAG5HJ.jpg", type: "photo"});
      result = IWitness.TwitterResult.create({text: '', entities: entities});
      expect(result.get("media").objectAt(0).constructor).toEqual(IWitness.TwitterHostedMedia);
    });

    it("contains a TwitterLinkedMedia object for each endities.urls", function(){
      entities.urls.push({expanded_url: "http://instagr.am/p/HxOi-1wLe_/"});
      result = IWitness.TwitterResult.create({text: '', entities: entities});
      expect(result.get("media").objectAt(0).constructor).toEqual(IWitness.TwitterLinkedMedia);
    });
  });

});
