window.IWitness = Ember.Application.create();

IWitness.log = _.bind(Ember.Logger.log, Ember.Logger);

// fill in test data
$(function(){
  _.delay(function(){
    $("#start_date").val("2/13/2012").trigger('change');
    $("#start_time").val("1:00 AM").trigger('change');
    $("#end_date").val("2/13/2012").trigger('change');
    $("#end_time").val("2:00 PM").trigger('change');
  }, 500);
});
