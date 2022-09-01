import path from 'path';
import imagemin from 'imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminJpegoptim from 'imagemin-jpegoptim';
import imageminSvgo from 'imagemin-svgo';
import imageminZopfli from 'imagemin-zopfli';
import jo from 'jpeg-autorotate';

const files = process.argv.slice(2);
const errors = [];
const imageminOpts = {
  glob: false,
  plugins: [
    imageminGifsicle({ optimizationLevel: 3 }),
    input => jo.rotate(input).then(({ buffer }) => buffer).catch(() => input),
    imageminJpegoptim({ progressive: true }),
    imageminSvgo({
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false
            }
          }
        }
      ]
    }),
    imageminZopfli({ more: true, transparent: true })
  ]
};

function registerError(error, step) {
  errors.push({ error, step });
}

await Promise.all(files.map(file =>
  imagemin([file], { destination: path.dirname(file), ...imageminOpts })
))
  .catch(err => registerError(err, 'imagemin'));

if (errors.length) {
  for (const { error, step } of errors) {
    console.error(`Error in step "${step}":`, error);
  }

  throw new Error('Asset optimization completed with errors.');
}
