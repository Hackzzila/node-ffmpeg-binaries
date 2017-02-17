'use strict';

const zlib = require('zlib');
const tar = require('tar');
const path = require('path');
const http = require('https');

function callback(res) {
  res
    .pipe(zlib.createGunzip())
    .pipe(tar.Extract({ path: path.join(__dirname, 'bin') }));
}

if (process.platform === 'win32') {
  http.get('https://raw.githubusercontent.com/Hackzzila/node-ffmpeg-binaries/master/windows.tar.gz', callback);
} else if (process.platform === 'linux') {
  http.get('https://raw.githubusercontent.com/Hackzzila/node-ffmpeg-binaries/master/linux.tar.gz', callback);
} else if (process.platform === 'darwin') {
  http.get('https://raw.githubusercontent.com/Hackzzila/node-ffmpeg-binaries/master/darwin.tar.gz', callback);
} else {
  throw new Error('unsupported platform');
}
