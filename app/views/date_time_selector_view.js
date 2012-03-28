IWitness.DateTimeSelector = Ember.View.extend({
  templateName: "date_time_selector_template",
  modelBinding: "IWitness.criteriaController.content",

  didInsertElement: function() {
    var self = this;
    this.datepicker = this.$(".datepicker").datepicker({
      onSelect: function(dateText, ui){
        if (dateText != self.get("dateValue")) {
          self.set("dateValue", dateText);
          IWitness.criteriaController.initiateSearch();
        }
        self.datepicker.hide();
      }
    }).hide();
  },

  pickDate: function(e){
    this.datepicker.show();
  },

  moment: function() {
    if (this.get("whichDate") == "start") {
      return this.getPath("model.rawStart");
    } else {
      return this.getPath("model.rawEnd");
    }
  }.property("model.rawStart", "model.rawEnd", "whichDate"),

  dateValue: function(key, value) {
    var type = this.get("whichDate");
    if (arguments.length == 1) {
      return this.getPath("model."+type+"DateString");
    } else {
      this.get("model").set(type+"DateString", value);
      return value;
    }
  }.property("model.startDateString", "model.endDateString"),

  timeValue: function() {
    var type = this.get("whichDate");
    if (arguments.length == 1) {
      return this.getPath("model."+type+"TimeString");
    } else {
      this.setPath("model."+type+"TimeString", value);
      return value
    }
  }.property("model.startTimeString", "model.endTimeString"),

  day: function(){
    return this.get("moment").format("DD");
  }.property("moment"),

  month: function(){
    return this.get("moment").format("MMM");
  }.property("moment"),

  year: function(){
    return this.get("moment").year();
  }.property("moment"),

  hours: function(){
    return this.get("moment").format("hh");
  }.property("moment"),

  minutes: function(){
    return this.get("moment").format("mm");
  }.property("moment"),

  period: function(){
    return this.get("moment").format("A");
  }.property("moment")
});
