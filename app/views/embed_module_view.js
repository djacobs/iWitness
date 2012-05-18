IWitness.EmbedModuleView = Ember.Object.extend({
  imagePath: window.location.origin + window.location.pathname + "images/",

  html: function(args) {
    var flaggedResults = IWitness.savedSetController.get("flaggedResults");
    var resultViews = flaggedResults.map(function(result) {
      return IWitness.ResultView.create({model: result});
    });
    Ember.run.sync();
    return IWitness.Templates.embed_module_template(this._makeViewModel(resultViews));
  },

  _makeViewModel: function(resultViews) {
    var resultViewModels = resultViews.map(this._makeResult);
    resultViewModels[resultViewModels.length-1].additionalClasses = "iwitness_last_item";
    return {
      imagePath: this.get("imagePath"),
      flaggedResults: resultViewModels
    };
  },

  _makeResult: function(view) {
    fields = "type postedDate postedTime staticMapUrl avatarSrc userNameSecondary userNamePrimary contentText displayableMedia".w()
    var media  = view.get("displayableMedia");
    var result = view.getProperties.apply(view, fields);
    result.displayableMedia = [];
    (media || []).forEach(function(m) {
      result.displayableMedia.push({
        isIframe: false,
        mediaUrl: m.get("mediaUrl"),
        linkUrl:  m.get("linkUrl")
      });
    });
    return result;
  }
});
