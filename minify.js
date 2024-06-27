const Terser = require('terser');
const glob = require('glob');
const fs = require('fs');

let files = glob.sync('dist/**/*.js');
files.forEach(function (file) {
  Terser.minify(fs.readFileSync(file, 'utf8')).then(result => {
    fs.writeFileSync(file, result.code);
  }).catch(err => {
    console.error(`Error while minifying ${file}: `, err);
  });
});
