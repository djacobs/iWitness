IWitness.WelcomeView = Ember.View.extend({
  templateName: "welcome_template",

  didInsertElement: function() {
    if (!localStorage["didSeeWelcomePage"]) {
      localStorage["didSeeWelcomePage"] = true;
      IWitness.currentViewController.set("showWelcome", true);
    }
  },

  isVisible: function() {
    return IWitness.currentViewController.get("showingWelcomeOverlay");
  }.property("IWitness.currentViewController.showingWelcomeOverlay"),

  close: function(e) {
    e.preventDefault();
    IWitness.currentViewController.set("showWelcome", false);
  }
});
