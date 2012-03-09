describe("CuratedResults", function(){
  var curated, tweet;
  beforeEach(function(){
    curated = new IWitness.CuratedResults();
    tweet = IWitness.TwitterResult.create({idStr: "1234"});
  });

  it("contains a result that we add", function(){
    curated.addResult(tweet);
    expect(curated.contains(tweet.get('resultId'))).toBeTruthy();
  });

  it("removes a result", function(){
    curated.addResult(tweet);
    curated.removeResult(tweet);
    expect(curated.contains(tweet.get('resultId'))).toBeFalsy();
  });
});
