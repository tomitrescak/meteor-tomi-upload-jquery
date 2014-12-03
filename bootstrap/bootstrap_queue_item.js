Template['bootstrap_queue_item'].events({
  'click .cancel': function (e) {
    Uploader.cancelUpload.call(this.parent, e, this.item.name);
  },
  'click .startItem': function (e) {
    Uploader.startUpload.call(this.parent, e, this.item.name);
  }
});

Template['bootstrap_queue_item'].helpers({
  'infoLabel': function() {
    var progress = this.parent.queue[this.item.name].get();
    return progress.started ?
      Uploader.formatProgress(this.item.name, progress.progress, progress.bitrate) :
      (this.item.name + '&nbsp;<span style="font-size: smaller; color: grey">' + bytesToSize(this.item.size) + '</span>');
  },
  buttonState: function() {
    var that = this;
    return {
      'idle': function () {
        return !that.parent.queue[that.item.name].get().running;
      },
      'cancelled': function () {
        return that.parent.queue[that.item.name].get().cancelled;
      },
      'waiting': function () {
        return that.parent.queue[that.item.name].get().progress !== 100;
      },
      'removeFromQueue': function() {
        return true;
      }
    }
  },
  'progress': function() {
    return 'width:' + this.parent.queue[this.item.name].get().progress + '%';
  }
});