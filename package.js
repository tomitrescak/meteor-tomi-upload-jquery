Package.describe({
  name: 'tomi:upload-jquery',
  summary: 'Client template for uploads using "jquery-file-upload" from blueimp',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('templating', 'client');

  api.addFiles([
    'lib/vendor/jquery.ui.widget.js',
    'lib/jquery.iframe-transport.js',
    'lib/jquery.fileupload.js'
  ], ['client']);

  api.addFiles(['upload_semantic_ui.html', 'upload_semantic_ui.js'], 'client');
});

//Package.onTest(function(api) {
//  api.use('tinytest');
//  api.use('tomi:upload-client');
//  api.addFiles('upload-client-tests.js');
//});
