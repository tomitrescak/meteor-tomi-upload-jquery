Template['bootstrap_buttons'].helpers({
  'idle': function() {
    return this.state.idle();
  },
  'cancelled': function() {
    return this.state.cancelled();
  },
  'waiting': function() {
    return this.state.waiting();
  },
  'removeFromQueue': function() {
    return this.state.removeFromQueue();
  }
});

Template['bootstrap_buttons'].events({
  'click .cancel': function (e) {
    Uploader.cancelUpload.call(this.uploadContext, e, this.name);
  },
  'click .start': function (e) {
    Uploader.startUpload.call(this.uploadContext, e, this.name);
  },
  'click .remove': function (e) {
    Uploader.removeFromQueue.call(this.uploadContext, e, this.name);
  }
});