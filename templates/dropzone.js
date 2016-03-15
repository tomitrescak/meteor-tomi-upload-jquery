// each upload_multiple template instance holds its own local collection of files list
Template['dropzone'].created = function () {
  // start automatically on drop
  Template.instance().autoStart = true;

  // init the control
  Uploader.init(this);
};

// each upload_multiple template instance holds its own local collection of files list
Template['dropzone'].helpers({
  'infoLabel': function() {
    var progress = Template.instance().globalInfo.get();

    // we may have not yet selected a file
    if (progress.progress == 0 || progress.progress == 100) {
      return Uploader.localisation.dropFiles;
    }
    return progress.progress + "%";
  },
  'submitData': function() {
    if (this.formData) {
      this.formData['contentType'] = this.contentType;
    } else {
      this.formData = {contentType: this.contentType};
    }
    return typeof this.formData == 'string' ? this.formData : JSON.stringify(this.formData);
  }
});

Template['dropzone'].rendered = function () {
  // initialise the uploader area
  Uploader.render.call(this);

  // allow visual clues for drag and drop area
  $(document).bind('dragover', function (e) {
    var dropZone = $('.jqDropZone'),
      foundDropzone,
      timeout = window.dropZoneTimeout;
    if (!timeout) {
      dropZone.addClass('in');
    }
    else {
      clearTimeout(timeout);
    }
    var found = false,
      node = e.target;
    do {
      if ($(node).hasClass('jqDropZone')) {
        found = true;
        foundDropzone = $(node);
        break;
      }
      node = node.parentNode;
    } while (node != null);

    dropZone.removeClass('in hover');
    if (found) {
      foundDropzone.addClass('hover');
    }
    window.dropZoneTimeout = setTimeout(function () {
      window.dropZoneTimeout = null;
      dropZone.removeClass('in hover');
    }, 100);
  });
};
