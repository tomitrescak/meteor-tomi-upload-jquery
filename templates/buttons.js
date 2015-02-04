Template['buttons'].helpers({
  'class': function(what) {
    return Uploader.UI[this.type][what] ;
  },
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

Template['buttons'].events({
  'click .cancel': function (e) {
    Uploader.cancelUpload.call(this.uploadContext, e, this.name);
  },
  'click .start': function (e) {
    Uploader.startUpload.call(this.uploadContext, e, this.name);
  },
  'click .remove': function (e) {
    Uploader.removeFromQueue.call(this.uploadContext, e, this.name);
  },
  'click .done': function(e) {
    Uploader.reset.call(this.uploadContext, e);
  }
});