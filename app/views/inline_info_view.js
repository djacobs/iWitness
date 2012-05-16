IWitness.InlineInfoView = Ember.View.extend({
  templateName:         "inline_info_template",
  classNames:           ["inline-info"],
  criteriaBinding:      "IWitness.criteriaController.content",
  twitterStatusBinding: "IWitness.searchController.monitors.twitter.status",
  flickrStatusBinding:  "IWitness.searchController.monitors.flickr.status",

  message: function() {
    var twitter  = this.get("twitterStatus");
    var flickr   = this.get("flickrStatus");
    var criteria = this.get("criteria");
    var endDate  = criteria.get("rawEnd");
    var messages = [];

    if (twitter === "no results") {
      if (flickr === "no results") {
        messages.push("We couldn't find anything.");
      } else {
        messages.push("There's not much here.");
      }

      if (endDate && endDate.isBefore(moment().subtract("days", 7))) {
        messages.push("Twitter doesn't let us look back in time more than about a week, so that might be why.");
      }

      if (criteria.get("zoom") >= 19) {
        messages.push("You're zoomed pretty far in on the map. Try zooming out to see if more turns up.");
      }
    }

    return messages.join(" ");
  }.property("twitterStatus", "flickrStatus", "criteria.rawEnd", "criteria.zoom"),

  isVisible: function() {
    return this.get("twitterStatus") === "no results";
  }.property("twitterStatus", "flickrStatus")
});
