window.IWitness = Ember.Application.create();

IWitness.log = _.bind(Ember.Logger.log, Ember.Logger);

// fill in test data
$(function(){
  _.delay(function(){
    $("#keyword").val("glass").trigger('change');
    $("#start_date").val("2/14/2012").trigger('change');
    $("#start_time").val("6:00 PM").trigger('change');
    $("#end_date").val("2/14/2012").trigger('change');
    $("#end_time").val("7:00 PM").trigger('change');
  }, 500);
});
