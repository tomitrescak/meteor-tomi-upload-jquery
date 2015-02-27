Uploader = {
  UI: {
    bootstrap: {
      upload: 'btn btn-primary btn-file upload-control',
      progressOuter: 'form-control upload-control',
      progressInner: 'progressInner',
      progressBar: 'progress-bar progress-bar-success progress-bar-striped',
      removeButton: 'btn btn-default upload-control remove',
      removeButtonIcon: 'glyphicon glyphicon-remove',
      startButton: 'btn btn-info upload-control start',
      startButtonIcon: 'glyphicon glyphicon-upload',
      doneButton: 'btn btn-default upload-control done',
      doneButtonIcon: 'glyphicon glyphicon-ok',
      cancelButton: 'btn btn-danger upload-control cancel',
      cancelButtonIcon: 'glyphicon glyphicon-stop',
      cancelledButton: 'btn btn-warning upload-control',
      cancelledButtonIcon: 'glyphicon glyphicon-cross'
    },
    semanticUI: {
      upload: 'ui icon button btn-file leftButton upload-control',
      progressOuter: 'progressOuter',
      progressInner: 'semantic progressInner',
      progressBar: 'bar progress-bar',
      removeButton: 'ui red button upload-control remove rightButton',
      removeButtonIcon: 'trash icon',
      startButton: 'ui button primary upload-control start rightButton',
      startButtonIcon: 'upload icon',
      doneButton: 'ui green button upload-control rightButton done',
      doneButtonIcon: 'icon thumbs up',
      cancelButton: 'ui yellow button upload-control cancel rightButton',
      cancelButtonIcon: 'icon stop',
      cancelledButton: 'ui yellow button upload-control rightButton'
    }
  },
  uploadUrl: '/upload',
  createName: function (templateContext) {
    if (templateContext.queue.length == 1) {
      var file = templateContext.queue[0];
      templateContext.info.set(file);
    } else {
      // calculate size
      var file = {
        name: templateContext.queue.length + ' files',
        size: templateContext.queue.size
      }
      templateContext.info.set(file);
    }
  },
  /**
   * Starts upload
   * @param e
   * @param {string} name Name of the file in the queue that we want to upload
   */
  startUpload: function (e, name) {
    if (e) e.preventDefault();

    if (this.queue.length == 0) return;

    var that = this;

    $.each(this.queue, function (index, queueItem) {

      var data = queueItem.data;
      if (name && data.files[0].name !== name) return true;

      data.jqXHR = data.submit()
        .done(function (data, textStatus, jqXHR) {
          console.log('data.sumbit.done: textStatus= ' + textStatus);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          if (jqXHR.statusText === 'abort') {
            that.info.set({
              name: 'Aborted',
              size: 0
            })
          } else {
            that.info.set({
              name: 'Failed: ' + jqXHR.responseText + ' ' + jqXHR.status + ' ' + jqXHR.statusText,
              size: 0
            })
          }
          console.log('data.sumbit.fail: ' + jqXHR.responseText + ' ' + jqXHR.status + ' ' + jqXHR.statusText);
        })
        .always(function (data, textStatus, jqXHR) {
          console.log('data.sumbit.always:  textStatus= ' + textStatus);
        });
    });
  },
  formatProgress: function (file, progress, bitrate) {
    return progress + "%&nbsp;of&nbsp;" + file + "&nbsp;<span style='font-size:smaller'>@&nbsp;" + bytesToSize(bitrate) + "&nbsp;/&nbsp;sec</span>"
  },
  removeFromQueue: function (e, name) {
    e.preventDefault();

    // remove from data queue
    var that = this;
    $.each(this.queue, function (index, item) {
      // skip all with different name
      if (item.name === name) {
        that.queue.splice(index, 1);
        return false;
      }
    });

    // set the queueView
    this.queueView.set(this.queue);

    // update name
    Uploader.createName(this);
  },
  reset: function(e) {
    e.preventDefault();
    this.globalInfo.set({running: false, cancelled: false, progress: 0, bitrate: 0});
    this.info.set("");
  },
  cancelUpload: function (e, name) {
    e.preventDefault();

    var that = this;
    $.each(this.queue, function (index, queueItem) {
      // skip all with different name
      if (name && queueItem.name !== name) return true;

      // cancel upload of non completed files
      if (that.queue[queueItem.name].get().progress !== 100) {
        queueItem.data.jqXHR.abort();

        // set status to redraw interface
        that.queue[queueItem.name].set({running: false, cancelled: true, progress: 0, bitrate: 0});
      }
    });

    // mark global as cancelled
    if (!name) {
      this.globalInfo.set({running: false, cancelled: true, progress: 0, bitrate: 0})
    }
  },
  init: function (data) {
    // this is used to view the queue in the interface
    data.queueView = new ReactiveVar([]);
    // this holds all the data about the queue
    data.queue = [];
    // info about the global item being processed
    data.info = new ReactiveVar;
    // info about global progress
    data.globalInfo = new ReactiveVar({running: false, progress: 0, bitrate: 0});
  },
  render: function () {
    // template context is the template instance itself
    var templateContext = this;
    templateContext.progressBar = this.$('.progress-bar');
    templateContext.progressLabel = this.$('.progress-label');
    templateContext.uploadControl = this.$('.jqUploadclass');
    templateContext.dropZone = this.$('.jqDropZone');

    // this.data holds the template context (arguments supplied to the template in HTML)
    var dataContext = this.data;

    // attach the context to the form object (so that we can access it in the callbacks such as add() etc.)
    this.find('form').uploadContext = templateContext;

    // set the upload related callbacks for HTML node that has jqUploadclass specified for it
    // Example html node: <input type="file" class="jqUploadclass" />
    templateContext.uploadControl.fileupload({
      url: Uploader.uploadUrl,
      dataType: 'json',
      dropZone: templateContext.dropZone,
      add: function (e, data) {
        console.log('render.add ');

        // validate before adding
        if (dataContext.callbacks != null &&
            dataContext.callbacks.validate != null &&
           !dataContext.callbacks.validate(data.files)) {
          return;
        }

        // update the queue collection, so that the ui gets updated
        $.each(data.files, function (index, file) {
          var item = file;
          item.data = data;
          templateContext.queue[file.name] = new ReactiveVar({running: false, progress: 0});
          templateContext.queue.push(item);
          templateContext.queue.size += parseInt(file.size);
        });

        // say name
        Uploader.createName(templateContext);

        // set template context
        templateContext.queueView.set(templateContext.queue);

        // we can automatically start the upload
        if (templateContext.autoStart) {
          Uploader.startUpload.call(templateContext);
        }

      }, // end of add callback handler
      done: function (e, data) {
        console.log('render.done ');

        templateContext.globalInfo.set({running: false, progress: 100});

        $.each(data.result.files, function (index, file) {
          Uploader.finished(index, file, templateContext);

          // validate before adding
          if (dataContext.callbacks != null &&
              dataContext.callbacks.finished != null) {
            dataContext.callbacks.finished(index, file, templateContext);
          }
        });
      },
      fail: function (e, data) {
        console.log('render.fail ');
      },
      progress: function (e, data) {
        // file progress is displayed only when single file is uploaded
        var fi = templateContext.queue[data.files[0].name];
        if (fi) {
          fi.set({
            running: true,
            progress: parseInt(data.loaded / data.total * 100, 10),
            bitrate: data.bitrate
          });
        }
      },
      progressall: function (e, data) {
        templateContext.globalInfo.set({
          running: true,
          progress: parseInt(data.loaded / data.total * 100, 10),
          bitrate: data.bitrate
        });
      },
      drop: function (e, data) { // called when files are dropped onto ui
        $.each(data.files, function (index, file) {
          console.log("render.drop file: " + file.name);
        });
      },
      change: function (e, data) { // called when input selection changes (file selected)
        // clear the queue, this is used to visualise all the data
        templateContext.queue = [];
        templateContext.queue.size = 0;
        templateContext.progressBar.css('width', '0%');
        templateContext.globalInfo.set({running: false, progress: 0});

        $.each(data.files, function (index, file) {
          console.log('render.change file: ' + file.name);
        });
      }
    })
      .prop('disabled', !$.support.fileInput)
      .parent().addClass($.support.fileInput ? undefined : 'disabled');
  },
  finished: function () {
  }
}

bytesToSize = function (bytes) {
  if (bytes == 0) return '0 Byte';
  var k = 1000;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + '&nbsp;' + sizes[i];
}
