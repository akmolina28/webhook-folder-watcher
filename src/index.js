const chokidar = require('chokidar');
const axios = require('axios')

const watch_folder = process.env.WATCH_FOLDER;
const webhook_url = process.env.WEBHOOK_URL;
const use_polling = process.env.WATCH_USE_POLLING || false;

const watcher = chokidar.watch('.', { 
  ignoreInitial: true,
  cwd: watch_folder,
  usePolling: use_polling
});

console.log('Starting watch for ' + watch_folder);
console.log('- webhook_url = ' + webhook_url);
console.log('- use_polling = ' + use_polling);

watcher.on('add', (path) => {
  console.log(`file added: ${path}`);
  axios
    .post(webhook_url, {
      file: path
    })
    .then(res => {
      console.log(`webhook result: ${res.status}`)
    })
    .catch(error => {
      console.error(error)
    });
  watcher.unwatch(path);
});
