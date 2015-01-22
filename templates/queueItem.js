Template['queueItem'].helpers({
  'class': function(what) {
    return Uploader.UI[this.type][what] ;
  },
  'infoLabel': function() {
    var progress = this.uploadContext.queue[this.item.name].get();
    return progress.running ?
      Uploader.formatProgress(this.item.name, progress.progress, progress.bitrate) :
      (this.item.name + '&nbsp;<span style="font-size: smaller; color: grey">' + bytesToSize(this.item.size) + '</span>');
  },
  buttonState: function() {
    var that = this;
    return {
      'idle': function () {
        return !that.uploadContext.queue[that.item.name].get().running ||
          that.uploadContext.queue[that.item.name].get().progress === 100;
      },
      'cancelled': function () {
        return that.uploadContext.queue[that.item.name].get().cancelled;
      },
      'waiting': function () {
        return that.uploadContext.queue[that.item.name].get().progress !== 100;
      },
      'removeFromQueue': function() {
        return true;
      }
    }
  },
  'progress': function() {
    return 'width:' + this.uploadContext.queue[this.item.name].get().progress + '%';
  }
});