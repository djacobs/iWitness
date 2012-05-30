IWitness.SavedView = Ember.View.extend({
  templateName: 'saved_template',
  isVisibleBinding: 'IWitness.currentViewController.showingSavedResults',

  didInsertElement: function() {
    var self = this;

    IWitness.get('body').on('click', function(e) {
      if ($(e.target).closest('.drop-down').length == 0) {
        self.$(".drop-down").removeClass("active");
      }
    });
  },

  exportSectionClass: function() {
    var num = IWitness.savedSetController.get('flaggedCount');
    return num > 0 ? '' : 'invisible';
  }.property('IWitness.savedSetController.flaggedCount'),

  numberOfItems: function(){
    var num = IWitness.savedSetController.get('length');
    return num + " saved item" + (num == 1 ? "" : "s");
  }.property('IWitness.savedSetController.length'),

  numberFlaggedForExport: function(){
    var num = IWitness.savedSetController.get('flaggedCount');
    return num + " flagged for export";
  }.property('IWitness.savedSetController.flaggedCount'),

  showExportText: function() {
    this.$('#copy-overlay').show().find("#text-content").show().end()
                                  .find("#html-content").hide();
  },

  showExportHtml: function() {
    var view = IWitness.EmbedModuleView.create();
    // this.$("#html-content").html(view.html()).show(); // For Testing
    this.$("#html-content").text(view.html()).show();
    this.$('#copy-overlay').show().find("#text-content").hide();
  },

  hideExportOverlay: function() {
    this.$('#copy-overlay').hide();
  },

  exportLink: Ember.View.extend({
    tagName:    'a',

    makeHref: function() {
      var results = [];
      var datetime = moment().format('MM/DD/YY h:mm a');

      $('#copy-overlay-content div pre').each(function(i, result) {
        results.push($(result).text());
      });
      results = results.join("\n");
      results += "\n\nShared via iWitness\n<http://"+ window.location.hostname +">";

      return "mailto:yourfriend@example.com?subject=Shared via iWitness "+datetime+"&body="+encodeURIComponent(results);
    },

    click: function(e) {
      var exportSize = IWitness.savedSetController.getPath('content.length');
      Analytics.track('saved results', 'exported', 'size of export', exportSize);
      e.target.href = this.makeHref();
    }
  }),

  toggleDropDown: function() {
    this.$(".drop-down").toggleClass("active");
  }
});
