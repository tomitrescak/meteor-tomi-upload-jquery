// each upload_multiple template instance holds its own local collection of files list
Template['upload_bootstrap'].created = function () {
  this.data.queue = new Meteor.Collection(null); // client local collection per instance
  this.data.info = new ReactiveVar
  this.data.fileInfos = [];
  this.data.globalInfo = new ReactiveVar({running: false, progress: 0, bitrate: 0});
};

Template['upload_bootstrap'].helpers({
  'infoLabel': function() {
    var progress = this.globalInfo.get();

    // we may have not yet selected a file
    if (!this.info.get()) {
      return "";
    }

    return progress.running ?
      Uploader.formatProgress(this.info.get().name, progress.progress, progress.bitrate) :
      (this.info.get().name + '&nbsp;<span style="font-size: smaller; color: grey">' + bytesToSize(this.info.get().size) + '</span>');
  },
  'progress': function() {
    return 'width:' + this.globalInfo.get().progress + '%';
  },
  buttonState: function() {
    var that = this;
    return {
      'idle': function () {
        return !that.globalInfo.get().running;
      },
      'cancelled': function () {
        return that.globalInfo.get().cancelled;
      },
      'waiting': function () {
        return that.globalInfo.get().progress !== 100;
      }
    }
  },
  'queueItems': function() {
    return this.queue.find();
  },
  'showQueue': function() {
    return this.queue.find().count() > 1;
  }
});

Template['upload_bootstrap'].rendered = function () {
  Uploader.render.call(this);
};

