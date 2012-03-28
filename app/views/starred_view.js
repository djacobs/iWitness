IWitness.StarredView = Ember.View.extend({
  templateName: 'starred_template',
  isVisibleBinding: 'IWitness.currentViewController.showingStarredResults',

  numberOfItems: function(){
    var num = IWitness.starredSetController.get('length');
    return num + " starred item" + (num == 1 ? "" : "s");
  }.property('IWitness.starredSetController.length'),

  numberFlaggedForExport: function(){
    var num = IWitness.starredSetController.get('flaggedCount');
    return num + " flagged for export";
  }.property('IWitness.starredSetController.flaggedCount'),

  showExportText: function() {
    this.$('#export-popover').show();
  },

  hideExportText: function() {
    this.$('#export-popover').hide();
  },

  exportLink: Ember.View.extend({
    tagName:    'a',
    classNames: 'button',

    makeHref: function() {
      var results = [];
      console.log('href');
      $('#rendered-text-results div pre').each(function(i, result) {
        results.push($(result).text());
      });
      results = results.join("\n");
      results += "\n\nShared via iWitness\n<http://iwitness.adaptivepath.com>";

      return "mailto:yourfriend@example.com?subject=iWitness Starred Results&body="+encodeURIComponent(results);
    },

    click: function(e) {
      var exportSize = IWitness.starredSetController.getPath('content.length');
      Analytics.track('starred results', 'exported', 'size of export', exportSize);
      e.target.href = this.makeHref();
    }
  })

});
