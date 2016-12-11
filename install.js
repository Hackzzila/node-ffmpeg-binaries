'use strict';

const targz = require('tar.gz');

if (process.platform === 'win32') {
  targz().extract('./windows.tar.gz', 'bin')
    .catch((err) => {
      throw err;
    });
} else if (process.platform === 'linux') {
  targz().extract('./linux.tar.gz', 'bin')
    .catch((err) => {
      throw err;
    });
}