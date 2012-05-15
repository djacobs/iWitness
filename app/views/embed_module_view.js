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
    var resultViewModels = resultViews.map(_.bind(this._makeResult, this));
    resultViewModels[resultViewModels.length-1].additionalClasses = "iwitness_last_item";
    return {
      imagePath: this.get("imagePath"),
      flaggedResults: resultViewModels
    };
  },

  _makeResult: function(view) {
    var media  = view.getPath("model.media.displayable");
    var result = this._getResultProperties(view);
    result.displayableMedia = [];
    (media || []).forEach(function(m) {
      result.displayableMedia.push({
        isIframe: false,
        mediaUrl: m.get("mediaUrl"),
        linkUrl:  m.get("linkUrl")
      });
    });
    return result;
  },

  _getResultProperties: function(view) {
    var viewFields = view.getProperties("type postedDate postedTime contentText".w());
    var modelFields = view.get("model").getProperties(
      "staticMapUrl avatarSrc userNameSecondary userNamePrimary displayableMedia".w());
    return _.extend(viewFields, modelFields);
  }
});
