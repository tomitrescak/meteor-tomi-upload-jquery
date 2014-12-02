Uploader = {
	uploadUrl: '/upload',
	createName: function(templateContext) {
		if (templateContext.queue.find().count() == 1) {
			var file = templateContext.queue.findOne();
			templateContext.info.set(file);
		} else {
			// calculate size
			var size = 0;
			$.each(templateContext.uploadData, function (index, data) {
				size += data.files[0].size;
			});

			var file = {
				name: templateContext.queue.find().count() + ' files',
				size: size
			}
			templateContext.info.set(file);
		}
	},
	startUpload: function(e, name) {
		e.preventDefault();

		if (this.queue.find().count() == 0) return;

		var that = this;

		$.each(this.uploadData, function (index, data) {

			if (name && data.files[0].name !== name) return true;

			data.jqXHR = data.submit()
				.done(function (data, textStatus, jqXHR) {
					console.log('data.sumbit.done: textStatus= ' + textStatus);
				})
				.fail(function (jqXHR, textStatus, errorThrown) {
					console.log('data.sumbit.fail: ' + jqXHR.responseText + ' ' + jqXHR.status + ' ' + jqXHR.statusText);
				})
				.always(function (data, textStatus, jqXHR) {
					console.log('data.sumbit.always:  textStatus= ' + textStatus);
				});
		});
	},
	formatProgress: function(file, progress, bitrate) {
		return progress + "%&nbsp;of&nbsp;" + file + "&nbsp;<span style='font-size:smaller'>@&nbsp;" + bytesToSize(bitrate) + "&nbsp;/&nbsp;sec</span>"
	},
	removeFromQueue: function(e, name) {
		e.preventDefault();

		// remove from visual queue
		this.queue.remove({name: name});

		// remove from data queue
		var that = this;
		$.each(this.uploadData, function (index, data) {
			// skip all with different name
			if (name && data.files[0].name === name) {
				that.uploadData.splice(index, 1);
				return false;
			}
		});

		// update name
		Uploader.createName(this);
	},
	cancelUpload: function (e, name) {
		e.preventDefault();

		var fis = this.fileInfos;

		$.each(this.uploadData, function (index, data) {
			// skip all with different name
			if (name && data.files[0].name !== name) return true;

			// cancel upload
			data.jqXHR.abort();

			// set info
			if (fis[name]) {
				fis[name].set({running: false, cancelled: true, progress: 0, bitrate: 0});
			}
		});

		// mark global as cancelled
		if (!name) {
			this.globalInfo.set({running: false, cancelled: true, progress: 0, bitrate: 0})
		}
	},
	render: function () {
		// this.data holds the template context (arguments supplied to the template in HTML)
		var templateContext = this.data;
		templateContext.progressBar = this.$('.progress-bar');
		templateContext.progressLabel = this.$('.progress-label');
		templateContext.uploadControl = this.$('.jqUploadclass');


		// attach the context to the form object (so that we can access it in the callbacks such as add() etc.)
		this.find('form').uploadContext = templateContext;

		// set the upload related callbacks for HTML node that has jqUploadclass specified for it
		// Example html node: <input type="file" class="jqUploadclass" />
		templateContext.uploadControl.fileupload({
			url: Uploader.uploadUrl,
			dataType: 'json',
			add: function (e, data) {
				console.log('render.add ');

				// add data to context, this is used to submit the added data and start upload
				templateContext.uploadData.push(data);

				// update the queue collection, so that the ui gets updated
				$.each(data.files, function (index, file) {
					templateContext.queue.insert(file);
				});

				// say name
				Uploader.createName(templateContext);

				// start upload
				if (!templateContext.startOnClick) {
					$.each(templateContext.uploadData, function (index, data) {
						data.submit();
					});
				}
			}, // end of add callback handler
			done: function (e, data) {
				console.log('render.done ');

				templateContext.globalInfo.set({running: false, progress: 100});

				$.each(data.result.files, function (index, file) {
					Uploader.finished(index, file);
				});
			},
			fail: function (e, data) {
				console.log('render.fail ');
			},
			progress: function (e, data) {
				// file progress is displayed only when single file is uploaded
				var fi = templateContext.fileInfos[data.files[0].name];
				if (fi) {
					fi.set({
						started: true,
						progress: parseInt(data.loaded / data.total * 100, 10),
						bitrate: data.bitrate
					});
				}
			},
			progressall: function (e, data) {
				templateContext.globalInfo.set({
					running: true,
					progress: parseInt(data.loaded / data.total * 100, 10),
					bitrate: data.bitrate});
			},
			drop: function (e, data) { // called when files are dropped onto ui
				$.each(data.files, function (index, file) {
					console.log("render.drop file: " + file.name);
				});
			},
			change: function (e, data) { // called when input selection changes (file selected)
				// clear the queue, this is used to visualise all the data
				templateContext.uploadData = [];
				templateContext.queue.remove({});
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
	finished: function () { }
}

bytesToSize = function (bytes) {
	if (bytes == 0) return '0 Byte';
	var k = 1000;
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var i = Math.floor(Math.log(bytes) / Math.log(k));
	return (bytes / Math.pow(k, i)).toPrecision(3) + '&nbsp;' + sizes[i];
}
