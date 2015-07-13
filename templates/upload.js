Template.registerHelper('ut9n', function (key){
    return Uploader.localisation[key];
});

// each upload_multiple template instance holds its own local collection of files list
Template['upload'].created = function () {
  Uploader.init(this);

  // copy values to context
  if (this.data) {
    this.autoStart = this.data.autoStart;
  }
};

Template['upload'].helpers({
  'class': function(where) {
    return Uploader.UI[this.type][where];
  },
  'uploadContext': function() {
    return Template.instance();
  },
  'submitData': function() {
    if (this.formData) {
      this.formData['contentType'] = this.contentType;
    } else {
      this.formData = {contentType: this.contentType};
    }
    return typeof this.formData == 'string' ? this.formData : JSON.stringify(this.formData);
  },
  'infoLabel': function() {
    var instance = Template.instance();

    var progress = instance.globalInfo.get();
    var info = instance.info.get()
    // we may have not yet selected a file
    if (!instance.info.get()) {
      return "";
    }

    return progress.running ?
      Uploader.formatProgress(info.name, progress.progress, progress.bitrate) :
      (info.name + '&nbsp;<span style="font-size: smaller; color: #333">' + bytesToSize(info.size) + '</span>');
  },
  'progress': function() {
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

Template['upload'].rendered = function () {
  Uploader.render.call(this);
};
