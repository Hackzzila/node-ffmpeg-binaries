const path = require('path');

module.exports = path.join(__dirname, `bin/ffmpeg${process.platform === 'win32' ? '.exe' : ''}`);
