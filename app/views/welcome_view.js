IWitness.WelcomeView = Ember.View.extend({
  templateName: "welcome_template",

  isVisible: function() {
    return IWitness.currentViewController.get("showingWelcomeOverlay");
  }.property("IWitness.currentViewController.showingWelcomeOverlay"),

  close: function(e) {
    e.preventDefault();
    IWitness.currentViewController.set("showWelcome", false);
  }
});
