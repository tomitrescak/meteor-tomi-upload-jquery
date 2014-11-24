Package.describe({
  name: 'tomi:upload-jquery',
  summary: 'Client template for uploads using "jquery-file-upload" from blueimp',
  version: '1.0.2',
  git: 'https://github.com/tomitrescak/meteor-tomi-upload-jquery.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use(['reactive-var', 'templating'], 'client');

  api.addFiles([
    'lib/vendor/jquery.ui.widget.js',
    'lib/jquery.iframe-transport.js',
    'lib/jquery.fileupload.js'
  ], ['client']);

  api.addFiles([
    'upload_semantic_ui.html',
    'upload_semantic_ui.js',
    'bootstrap.css',
    'upload_bootstrap.html',
    'upload_bootstrap.js',
    'uploader.js'], 'client');

  api.export('Uploader', 'client');
});

//Package.onTest(function(api) {
//  api.use('tinytest');
//  api.use('tomi:upload-client');
//  api.addFiles('upload-client-tests.js');
//});
