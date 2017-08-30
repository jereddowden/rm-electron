const fs = require("fs");
const SevenZipPath = require('7zip-bin');
const Zip = require('node-7z');
const myTask = new Zip();

function beginExtraction(name,dest) {
    myTask.extractFull(name, dest)
        .progress(function (files) {
          console.log('Some files are extracted: %s', files);
        })
        .then(function () {
          console.log('Extracting done!');
        })
        .catch(function (err) {
          console.error(err);
        });
}

function handleFileSelect(fileList) {
    fs.readdir(fileList, (err, files) => {
        for (var i = 0, f; f = files[i]; i++) {
            if (f.type === 'application/x-7z-compressed' || f.type === 'application/zip') {
                beginExtraction(f, '/');
            }
        }
    });
}
