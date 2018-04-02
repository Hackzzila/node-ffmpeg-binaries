const http = require('https');
const readline = require('readline');
const decompress = require('decompress');
const tarxz = require('decompress-tarxz');
const unzip = require('decompress-unzip');

function callback(plugin) {
  return (res) => {
    let buf = Buffer.alloc(0);

    let last;
    let complete = 0;
    const total = res.headers['content-length'];

    res.on('data', (chunk) => {
      buf = Buffer.concat([buf, chunk]);

      complete += chunk.length;
      const progress = Math.round((complete / total) * 20);

      if (progress !== last) {
        readline.cursorTo(process.stdout, 0, null);

        process.stdout.write(`Downloading binary: [${'='.repeat(progress)}${[' '.repeat(20 - progress)]}] ${Math.round((complete / total) * 100)}%`);

        last = progress;
      }
    });

    res.on('end', () => {
      readline.cursorTo(process.stdout, 0, null);
      process.stdout.write(`Downloading binary: [${'='.repeat(20)}] 100%`);

      decompress(buf, 'bin', {
        plugins: [plugin()],
        strip: process.platform === 'linux' ? 1 : 2,
        filter: x => x.path === (process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'),
      });
    });
  };
}

if (process.platform === 'win32') {
  switch (process.arch) {
    case 'x64':
      http.get('https://ffmpeg.zeranoe.com/builds/win64/static/ffmpeg-latest-win64-static.zip', callback(unzip));
      break;
    case 'ia32':
      http.get('https://ffmpeg.zeranoe.com/builds/win32/static/ffmpeg-latest-win32-static.zip', callback(unzip));
      break;
    default:
      throw new Error('unsupported platform');
  }
} else if (process.platform === 'linux') {
  switch (process.arch) {
    case 'x64':
      http.get('https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-64bit-static.tar.xz', callback(tarxz));
      break;
    case 'ia32':
      http.get('https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-32bit-static.tar.xz', callback(tarxz));
      break;
    case 'arm':
      http.get('https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-armhf-32bit-static.tar.xz', callback(tarxz));
      break;
    case 'arm64':
      http.get('https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-64bit-static.tar.xz', callback(tarxz));
      break;
    default:
      throw new Error('unsupported platform');
  }
} else if (process.platform === 'darwin') {
  switch (process.arch) {
    case 'x64':
      http.get('https://ffmpeg.zeranoe.com/builds/macos64/static/ffmpeg-latest-macos64-static.zip', callback(unzip));
      break;
    default:
      throw new Error('unsupported platform');
  }
} else {
  throw new Error('unsupported platform');
}
