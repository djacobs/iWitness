window.IWitness = Ember.Application.create();

// fill in test data
$(function(){
  _.delay(function(){
    $("#keyword").val("grammys").trigger('change');
    $("#start_date").val("2/12/2012").trigger('change');
    $("#start_time").val("6:00 AM").trigger('change');
    $("#end_date").val("2/13/2012").trigger('change');
    $("#end_time").val("6:00 AM").trigger('change');
  }, 500);
});
