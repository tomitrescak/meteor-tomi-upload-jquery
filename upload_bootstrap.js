Template['upload_bootstrap'].events({
  'click .cancelUpload': function (e) {
    Uploader.cancelUpload(e);
  }
});

Template['upload_bootstrap'].rendered = function () {
  Uploader.render.call(this);
};