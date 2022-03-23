// dependencies
const chokidar = require('chokidar');
var FormData = require('form-data');
var fs = require('fs');

// load environment variables
const watch_folder = process.env.WATCH_FOLDER;
const webhook_url = process.env.WEBHOOK_URL;
const use_polling = process.env.WATCH_USE_POLLING || 'false';
const delete_after_posting = process.env.DELETE_AFTER_POSTING || 'false';

console.log('Starting watch for ' + watch_folder);
console.log('- webhook_url = ' + webhook_url);
console.log('- use_polling = ' + use_polling);
console.log('- delete_after_posting = ' + delete_after_posting);


// configure watcher
const watcher = chokidar.watch(["./**/*.jpg", "./**/*.jpeg"], { 
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 500,
    pollInterval: 100
  },
  cwd: watch_folder,
  usePolling: use_polling == 'true'
});

// bind to events that trigger after a file is added
watcher.on('add', (path) => {
  let imagePath = watch_folder + '/' + path;
  console.log(`file added: ${path}`);
  
  var form = new FormData();
  form.append('image_file', fs.readFileSync(watch_folder + '/' + path), {
    filename: imagePath.replace(/\//g,"_"),
    contentType: 'image/jpeg'
  });

  form.submit(webhook_url, function(err, res) {
    if (err) console.error(err);

    else {
      console.log(res.statusCode + '|' + res.statusMessage);
  
      if (delete_after_posting == 'true') {
        fs.unlink(watch_folder + '/' + path, function(err) {
          if (err) console.error(err);
          else console.log('Deleted ' + path);
        });
      }
    }

  });
});
