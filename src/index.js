const chokidar = require('chokidar');
const axios = require('axios')

const watch_folder = process.env.WATCH_FOLDER;
const webhook_url = process.env.WEBHOOK_URL;

const watcher = chokidar.watch('.', { 
  ignoreInitial: true,
  cwd: watch_folder
});

watcher.on('add', (path) => {
  console.log(`file added: ${path}`);
  axios
    .post(webhook_url, {
      file: path
    })
    .then(res => {
      console.log(`result: ${res}`)
    })
    .catch(error => {
      console.error(error)
    })
});
