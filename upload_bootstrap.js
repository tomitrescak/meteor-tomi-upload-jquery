Template['template_upload_multiple'].events({
  'click .cancelUpload': function (e) {
    Uploader.cancelUpload(e);
  }
});

Template['template_upload_multiple'].rendered = function () {
  Uploader.render.call(this);
};

Template['template_upload_single'].events({
  'click .cancelUpload': function (e) {
    Uploader.cancelUpload(e);
  }
});

Template['template_upload_single'].rendered = function () {
  Uploader.render.call(this);
};

// each upload_multiple template instance holds its own reactive queue of files list
Template['template_upload_multiple'].created = function () {
	this.varFilesQueue = new ReactiveVar;
	this.varFilesQueue.set([]);
};
// file_upload_rows is sub_template inside the upload_multiple template
// so, we have to access the reactive files list from the parent template and return it
Template['template_file_upload_rows'].helpers({
	file_upload_list: function () { return Template.instance().view.parentView.templateInstance().varFilesQueue.get(); }
});