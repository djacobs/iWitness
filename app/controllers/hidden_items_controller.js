IWitness.hiddenItemsController = Ember.Object.create({
  paused: false,
  hiddenItemsCount: 0,
  unpauseCallbacks: [],

  pause: function(){
    this.set('paused', true);
  },

  unpause: function(){
    this.set('paused', false);
    this.set('hiddenItemsCount', 0);
    this.get("unpauseCallbacks").forEach( function(callback) {
      callback.fn.apply(callback.context, callback.args);
    });
    this.set('unpauseCallbacks', []);
  },

  executeWhenVisible: function(context, fn){
    var args = Array.prototype.slice.call(arguments, 2);

    if(this.get('paused'))
      this.unpauseCallbacks.push({context: context, fn: fn, args: args});
    else
      fn.apply(context, args);
  },

  hasHiddenItems: function(){
    return this.get('hiddenItemsCount') > 0;
  }.property('hiddenItemsCount'),

  // implement array observer callbacks to monitor resultSetController
  arrayWillChange: function(){},
  arrayDidChange: function(arrayController, start, removeCount, addCount){
    if (this.get('paused') && addCount > 0){
      // work around an ember bug by checking addCount > 0
      this.incrementProperty('hiddenItemsCount', addCount);
    }
  }
  // end array observer callbacks

});

$(function(){
  IWitness.resultSetController.addArrayObserver(IWitness.hiddenItemsController);
});
