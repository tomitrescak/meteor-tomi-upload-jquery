// each upload_multiple template instance holds its own local collection of files list
Template['upload_semanticUI'].created = function () {
  Uploader.init(this);
};

Template['upload_semanticUI'].helpers({
  'uploadContext': function() {
    return Template.instance();
  },
  'submitData': function() {
    if (this.formData) {
      this.formData['contentType'] = this.contentType;
    } else {
      this.formData = { contentType: this.contentType };
    }
    return JSON.stringify(this.formData);
  },
  'infoLabel': function() {
    //if (!this.globalInfo) {
    //  Uploader.init(this);
    //}

    var instance = Template.instance();

    var progress = instance.globalInfo.get();
    var info = instance.info.get()
    // we may have not yet selected a file
    if (!instance.info.get()) {
      return "";
    }

    return progress.running ?
      Uploader.formatProgress(info.name, progress.progress, progress.bitrate) :
      (info.name + '&nbsp;<span style="font-size: smaller; color: grey">' + bytesToSize(info.size) + '</span>');
  },
  'progress': function() {
    //if (!this.globalInfo) {
    //  Uploader.init(this);
    //}
    return 'width:' + Template.instance().globalInfo.get().progress + '%';
  },
  buttonState: function() {
    var that = Template.instance();
    return {
      'idle': function () {
        return !that.globalInfo.get().running;
      },
      'cancelled': function () {
        return that.globalInfo.get().cancelled;
      },
      'waiting': function () {
        return that.globalInfo.get().progress !== 100;
      },
      'removeFromQueue': function() {
        return false;
      }
    }
  },
  'queueItems': function() {
    return Template.instance().queueView.get();
  },
  'showQueue': function() {
    return Template.instance().queueView.get().length > 1;
  }
});

Template['upload_semanticUI'].rendered = function () {
  Uploader.render.call(this);
};

