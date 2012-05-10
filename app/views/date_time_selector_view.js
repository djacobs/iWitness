IWitness.DateTimeSelector = Ember.View.extend({
  templateName: "date_time_selector_template",
  modelBinding: "IWitness.criteriaController.content",

  didInsertElement: function() {
    this.datepicker = this.$(".datepicker").datepicker({
      onSelect: _.bind(this.setDate, this)
    }).hide();

    this.$(".datepicker .ui-datepicker").on("click.pickDate", function(e){ e.stopPropagation(); });
    this.timepicker = this.$('.ec-time-picker');
    this.timepicker.find('.column').click(_.bind(this.setTime, this));
  },

  pickDate: function(e){
    e.stopPropagation();
    var datepicker = this.datepicker;

    datepicker.show();
    $(document).on('click.pickDate', function(e){
      $(document).off("click.pickDate");
      datepicker.hide();
    });
  },

  setDate: function(dateText, ui){
    if (dateText != self.get("dateValue")) {
      this.set("dateValue", dateText);
      IWitness.criteriaController.initiateSearch();
    }
    this.datepicker.hide();
  },

  pickTime: function(e) {
    e.stopPropagation();
    var timepicker = this.timepicker;

    timepicker.find('.hour a[data-val="'+ this.get("hours") +'"]').addClass("active");
    timepicker.find('.minute a[data-val="'+ this.get("minutes") +'"]').addClass("active");
    timepicker.find('.period a[data-val="'+ this.get("period") +'"]').addClass("active");
    timepicker.show();

    $(document).on('click.pickTime', function(e){
      $(document).off("click.pickTime");
      timepicker.hide();
    });
  },

  setTime: function(e) {
    var changed = $(e.target);
    e.preventDefault();
    e.stopPropagation();
    if (changed.hasClass("active")) return;

    changed.siblings().removeClass("active").end()
           .addClass("active");
    var hour = this.$('.hour .active').data("val");
    var minute = this.$('.minute .active').data("val");
    var period = this.$('.period .active').data("val");

    this.set("timeValue", hour+":"+minute+" "+period);
    IWitness.criteriaController.initiateSearch();
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

  setCalendarDate: function() {
    if (this.datepicker) {
      this.datepicker.datepicker("setDate", this.get("dateValue"));
    }
  }.observes("dateValue"),

  timeValue: function(key, value) {
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
