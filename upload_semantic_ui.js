var upload;
var template;

Template['upload_semantic_ui'].events({
  'click .cancelUpload': function (e) {
    e.preventDefault();

    var platform = e.currentTarget.attributes['data-platform'].value;

    if (uploads[platform] == null) return;
    uploads[platform].abort();
  }
});

Template['upload_semantic_ui'].rendered = function () {
  // Change this to the location of your server-side upload handler:
  var url = '/upload';
  var that = this;

  $('.uploadControl').fileupload({
    url: url,
    dataType: 'json',
    add: function (e, data) {
      //// name depends on the content
      //var content = document.app_content;
      //
      //var contentType = content.contentType;
      //var folderName = content.folder;
      //var contentPlatform = data.form.find('#contentPlatform').val();
      //var fileName = content.urlTitle;
      //if (contentPlatform === 'screenshot') {
      //  fileName += '-' + Date.now() + "." + getFileExtension(data.files[0].name);
      //} else {
      //  fileName += '-' + contentPlatform + "." + getFileExtension(data.files[0].name);
      //}
      //
      //data.formData = {
      //  fileName: fileName,
      //  folder: folderName,
      //  contentType: contentType,
      //  contentPlatform: contentPlatform
      //};
      //
      //$('#filePicker-' + contentPlatform).hide('slow');
      //$('#progressHolder-' + contentPlatform).show('slow');

      // remember the xhr
      upload = data.submit()
        //.success(function (result, textStatus, jqXHR) {  })
        .error(function (jqXHR, textStatus, errorThrown) {
          if (errorThrown === 'abort') {
            $('#progressHolder-' + data.formData.contentPlatform).hide('slow');
            $('#filePicker-' + data.formData.contentPlatform).show('slow');
          }
        })
      //.complete(function (result, textStatus, jqXHR) {
      //  alert('Done!');
      //});
    },
    done: function (e, data) {
      var id = $('#uploadHolder').attr('itemId');

      $.each(data.result.files, function (index, file) {
        // add it to the collection
        //Uploads.insert({
        //  itemId: id,
        //  name: file.name
        //});

        var content = document.app_content;
        content.contentUploaded(
          data.formData.contentType,
          data.formData.contentPlatform,
          data.formData.fileName,
          data.formData.folder);

        $('#progressHolder-' + data.formData.contentPlatform).hide('slow');
        $('#filePicker-' + data.formData.contentPlatform).show('slow');
      });
    },
    progressall: function (e, data) {
      //uploadData = data;
      var progress = parseInt(data.loaded / data.total * 100, 10);

      $('#uploadInfo').css(
        'width',
        progress + '%'
      );
      $('#uploadData').html(bytesToSize(data.loaded) + "/" +
      bytesToSize(data.total) + "&nbsp;@&nbsp;" + bytesToSize(data.bitrate) + "&nbsp;/&nbsp;sec");
    }
  })
    .prop('disabled', !$.support.fileInput)
    .parent().addClass($.support.fileInput ? undefined : 'disabled');
};

function bytesToSize(bytes) {
  if (bytes == 0) return '0 Byte';
  var k = 1000;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + '&nbsp;' + sizes[i];
}