describe("SpaceTime", function() {
  var dstTime, stdTime, ny, sf;

  beforeEach(function() {
    ny = [40.728196,-73.996923];
    sf = [37.797464,-122.394772];

    // east of UTC
    de = [52.548075,13.411097];

    stdTime = new Date(2012, 1, 1);
    dstTime = new Date(2012, 6, 1);

    waitsFor(function() {
      return IWitness.spaceTime.get("isLoaded");
    });
  });

  it("returns EST offset", function() {
    expect(IWitness.spaceTime.utcOffset(stdTime, ny)).toEqual(-300);
  });

  it("returns EDT offset", function() {
    expect(IWitness.spaceTime.utcOffset(dstTime, ny)).toEqual(-240);
  });

  it("returns PST offset", function() {
    expect(IWitness.spaceTime.utcOffset(stdTime, sf)).toEqual(-480);
  });

  it("returns PST offset", function() {
    expect(IWitness.spaceTime.utcOffset(dstTime, sf)).toEqual(-420);
  });

  it("returns deutchland standard time", function() {
    expect(IWitness.spaceTime.utcOffset(stdTime, de)).toEqual(60);
  });

  it("returns deutchland savings time", function() {
    expect(IWitness.spaceTime.utcOffset(dstTime, de)).toEqual(120);
  });
});
