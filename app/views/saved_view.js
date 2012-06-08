IWitness.SavedView = Ember.View.extend({
  templateName: 'saved_template',
  isVisibleBinding: 'IWitness.currentViewController.showingSavedResults',


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
    var results = [];

    $('#text-content pre').each(function(i, result) {
      results.push($(result).text());
    });
    results = results.join("\n");
    results += "\n\nShared via iWitness\n<http://"+ window.location.hostname +">";

    this.$('#copy-overlay').show().find("#text-area-content").text(results).show().end()
                                  .find("#html-content").hide();
  },

  showExportHtml: function() {
    var view = IWitness.EmbedModuleView.create();
    this.$('#copy-overlay').show().find("#html-content").text(view.html()).show().end()
                                  .find("#text-area-content").hide();
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

  toggleDropDown: function(e) {
    var dropdown = this.$(".drop-down");
    if(!dropdown.hasClass("active")) {
      $(document).trigger("click.toggleDropDown");
      e.stopPropagation();
      dropdown.toggleClass("active");
      $(document).on('click.toggleDropDown', function(e){
        $(document).off("click.toggleDropDown");
        dropdown.toggleClass("active");
      });
    }
  }
});
