'use strict';

const zlib = require('zlib');
const tar = require('tar');
const path = require('path');
const http = require('https');

function callback(res) {
  res
    .pipe(zlib.createGunzip())
    .pipe(tar.Extract({
      path: path.join(__dirname, 'bin')
    }));
}

if (process.platform === 'win32') {
  switch (process.arch) {
    case 'x64':
      http.get('https://ffmpeg.zeranoe.com/builds/win64/static/ffmpeg-latest-win64-static.zip', callback);
      break;
    case 'ia32':
      http.get('https://ffmpeg.zeranoe.com/builds/win32/static/ffmpeg-latest-win32-static.zip', callback);
      break;
    default:
      throw new Error('unsupported platform');
  }
} else if (process.platform === 'linux') {
  switch (process.arch) {
    case 'x64':
      http.get('https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-64bit-static.tar.xz', callback);
      break;
    case 'ia32':
      http.get('https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-32bit-static.tar.xz', callback);
      break;
    case 'arm':
      http.get('https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-64bit-static.tar.xz', callback);
      break;
    default:
      throw new Error('unsupported platform');
  }
} else if (process.platform === 'darwin') {
  switch (process.arch) {
    case 'x64':
      http.get('https://ffmpeg.zeranoe.com/builds/macos64/static/ffmpeg-latest-macos64-static.zip', callback);
      break;
    default:
      throw new Error('unsupported platform');
  }
} else {
  throw new Error('unsupported platform');
}