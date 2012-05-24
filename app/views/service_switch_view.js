IWitness.ServiceSwitchView = Ember.View.extend({
  templateName: "service_switch_template",
  classNames: ["row"],

  type: function() {
    var type = this.getPath("model.type");
    return type.toUpperCase().charAt(0) + type.substring(1);
  }.property("model.type"),

  status: function() {
    if (this.getPath("model.active"))
      return "service-switch on";
    return "service-switch off";
  }.property("model.active"),

  toggle: function() {
    this.get("model").toggleProperty("active");
  }
});
