Uploader = {
	uploadUrl: '/upload',
	cancelUpload: function (e) {
		e.preventDefault();
		var upload_jqXHR = e.currentTarget.form.upload_context.submit_jqXHR;
		if (upload_jqXHR != null) {
			upload_jqXHR.abort();
		}
	},
	render: function () {

		// this.data holds the template context (arguments supplied to the template in HTML) 
		var template_context = this.data;
		template_context.picker = this.$('.uploadFilePicker');
		template_context.progress = this.$('.uploadProgressHolder');
		template_context.progressBar = this.$('.uploadProgressBar');
		template_context.progressLabel = this.$('.uploadProgressLabel');

		// attach the context to the form object (so that we can access it in the callbacks such as add() etc.)
		this.find('form').upload_context = template_context;

		this.$('.upload').fileupload({
			url: Uploader.uploadUrl,
			dataType: 'json',
			add: function (e, data) {
				console.log('render.add ');
				// get the upload context we stored earlier with form
				var upload_context = data.form[0].upload_context;
				data.formData = { contentType: upload_context.contentType };
				// tie an element node for the life cycle of upload
				data.context = $('<button/>').text('Upload').appendTo(document.body).click(function (){				
                    data.context = $('<p/>').text('Uploading...').replaceAll($(this));
                    data.submit();                
				});
				// modify controls
				upload_context.picker.hide('slow');
				upload_context.progress.show('slow');
				// Submit the data for upload with ajax; Ref: http://api.jquery.com/jQuery.ajax/#jqXHR
				upload_context.submit_jqXHR = data.submit()
					.done(function (data, textStatus, jqXHR) {
						console.log('data.sumbit.done: textStatus= ' + textStatus);
					})
					.fail(function (jqXHR, textStatus, errorThrown) {
						console.log('data.sumbit.fail: ' + jqXHR.responseText + ' ' + jqXHR.status + ' ' + jqXHR.statusText);
					})
					.always(function (data, textStatus, jqXHR) {
						console.log('data.sumbit.always:  textStatus= ' + textStatus);
						// reset the ui						
						upload_context.picker.show('slow');
						upload_context.progress.hide('slow');
					});
			}, // end of add callback handler
			done: function (e, data) {
				console.log('render.done ');
				var upload_context = data.form[0].upload_context;
				$.each(data.result.files, function (index, file) {
					Uploader.finished(index, file);
					upload_context.picker.show('fast');
					upload_context.progress.hide('fast');
				});
			},
			fail: function (e, data) {
				console.log('render.fail ');
			},
			progressall: function (e, data) {
				var progressVal = parseInt(data.loaded / data.total * 100, 10);
				e.target.form.upload_context.progressBar.css('width', progressVal + '%');
				e.target.form.upload_context.progressLabel.html(bytesToSize(data.loaded) + "/" + bytesToSize(data.total) + "&nbsp;@&nbsp;" + bytesToSize(data.bitrate) + "&nbsp;/&nbsp;sec");
				console.log('render.progressall progress=', progressVal + " bitrate: " + data.bitrate + " Bps");
			},
			drop: function (e, data) {
				$.each(data.files, function (index, file) {
					console.log("render.drop file: " + file.name);
				});
			},
			change: function (e, data) {
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

function bytesToSize(bytes) {
  if (bytes == 0) return '0 Byte';
  var k = 1000;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + '&nbsp;' + sizes[i];
}

