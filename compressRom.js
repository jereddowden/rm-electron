const path = require("path");
const fs = require("fs");
const SevenZip = require('7zip-bin');
const chld = require('child_process');
const ProgressBar = require('progressbar.js')

const emulators = [
    'NES',
    'SG',
    'SNES',
    'GB',
    'GBC',
    'GBA',
    'DS',
    '32X',
    'GEN',
    'N64',
    'MS',
    'AT26',
    'LYNX',
    'GG',
    'NGP',
    'NGC',
    'PC',
    'ZMAC'
];

const extensions = [
    [".nes", ".smc", ".sfc", ".fig", ".swc", ".mgd", ".fds"],
    [".sg"],
    [".smc", ".sfc", ".fig", ".swc"],
    [".gb"],
    [".gbc"],
    [".gba"],
    [".nds"],
    [".32x", ".smd", ".bin", ".md"],
    [".smd", ".bin", ".md", ".iso", ".gen"],
    [".z64", ".n64", ".v64"],
    [".sms"],
    [".bin", ".a26", ".rom", ".gz"],
    [".lnx"],
    [".gg"],
    [".ngp"],
    [".ngc"],
    [".pce", ".cue"],
    [".dat", ".z1", ".z2", ".z3", ".z4", ".z5", ".z6", ".z7", ".z8"]
];

var extracted;
var line = new ProgressBar.Line('#progress');

function extract(dest,name) {
    var exportPath = path.resolve(dest, name);
    chld.execSync(SevenZip.path7za + ' x ' + '"' + exportPath + '" -o"' + path.resolve(dest, 'RetroManagerExtract') + '/"',
      function (error, stdout, stderr) {
        // console.log('stdout: ' + stdout);
        // console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
        line.animate((0.1), {duration: 100});
    });
}
function compress(dest,name) {
    var inputPath;
    // console.log(extracted);
    if (extracted) {
        inputPath = path.resolve(path.resolve(dest, 'RetroManagerExtract'), name);
    } else {
        inputPath = path.resolve(dest, name);
    }
    // console.log(inputPath);
    chld.execSync(SevenZip.path7za + ' a -t7z -m0=lzma -mx=9 -mfb=64 -md=32m -ms=on ' + '"' + path.resolve(path.resolve(dest, 'RetroManagerCompress'), path.parse(name).name) + '.7z" "' + inputPath + '"',
      function (error, stdout, stderr) {
        // console.log('stdout: ' + stdout);
        // console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
        line.animate((0.1), {duration: 100});
    });
}

function checkForExtraction(fileList) {
    var files = fs.readdirSync(fileList[0].path);
    if (document.getElementById('extractFirst').checked) {
        for (var i = 0, f; f = files[i]; i++) {
            if (path.extname(f) === ".7z" || path.extname(f) === ".zip") {
                extract(fileList[0].path, f);
            }
        }
        extracted = true;
        return fs.readdirSync(fileList[0].path+'/RetroManagerExtract');
    }
    return fs.readdirSync(fileList[0].path);
}

function handleFiles(fileList) {
    var files = checkForExtraction(fileList);
    // try {
        for (var i = 0, f; f = files[i]; i++) {
            for (var j = 0, k; k = emulators[j]; j++) {
                if (document.getElementById(k).checked) {
                    for (var l = 0, m; m = extensions[j][l]; l++) {
                        if (path.extname(f) === m) {
                            // console.log('start compression of rom');
                            compress(fileList[0].path, f);
                        }
                    }
                }
            }
        }
    // } catch (err) {
    //     console.log("Idk I guess something went wrong");
    // }
}

document.getElementById('submit').onclick = function() {
    handleFiles(document.getElementById('directory').files)
};
