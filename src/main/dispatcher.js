const { ipcMain, dialog } = require('electron');
const fs = require('fs');
const Webtorrent = require('webtorrent');

const client = new Webtorrent();

module.exports = {
  getTorrent: () => {
    ipcMain.on('add-torrent', (event, arg) => {
      const content = 'Some text to save into the file';
      dialog
        .showOpenDialog({
          properties: ['openDirectory'],
        })
        .then(fileName =>
          // fs.writeFile(fileName.filePath, content, err => {
          //   if (err) {
          //     alert(`An error ocurred creating the file ${err.message}`);
          //   }
          //   alert('The file has been succesfully saved');
          // }),
          client.add(arg, { path: fileName.filePaths[0] }),
        );
    });
  },
};
