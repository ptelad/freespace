/**
 * Created by eladgil on 14/03/2017.
 */
'use strict';

const cp = require('child_process');
const driveOrMountRegex = /(^[a-zA-Z]$|^\/.*)/;
const DRIVE_STRING_ERROR = 'driveOrMount is invalid';

function getBytesFromOutput(output) {
    let bytes;

    if (process.platform === 'win32') {
        output = /avail free bytes\s*:\s*(\d*)/.exec(output.toString())[1];
        bytes = parseInt(output);
    } else {
        output = output.toString();
        bytes = parseInt(output) * 512;
    }

    return bytes;
}

exports.check = function(driveOrMount, callback) {
    return new Promise(function(resolve, reject) {
        let cb = function(err, stdout, stderr) {
            console.log(stderr.toString());
            if (err) {
                if (callback) callback(err);
                reject(err);
            } else if (stderr) {
                let err = new Error(stderr.toString());
                if (callback) callback(err);
                reject(err);
            } else {
                let bytes = getBytesFromOutput(stdout);
                if (callback) callback(null, bytes);
                resolve(bytes);
            }
        };
        if (!driveOrMountRegex.test(driveOrMount)) {
            let err = new Error(DRIVE_STRING_ERROR);
            if (callback) callback(err);
            return reject(err);
        }
        if (process.platform === 'win32') {
            driveOrMount = driveOrMount.charAt(0).toLowerCase();
            cp.exec(`fsutil volume diskfree ${driveOrMount}:`, {}, cb);
        } else {
            cp.exec(`df -P ${driveOrMount} | awk 'NR==2 {print $4}'`, {}, cb);
        }
    }).then(function(bytes) { return bytes })
        .catch(function(err) { return Promise.reject(err) });
};

exports.checkSync = function(driveOrMount) {
    let output;
    let stderr = new Buffer(16);
    let options = {
        stdio: ['pipe', 'pipe', stderr]
    };

    if (!driveOrMountRegex.test(driveOrMount)) {
        throw new Error(DRIVE_STRING_ERROR);
    }
    if (process.platform === 'win32') {
        driveOrMount = driveOrMount.charAt(0).toLowerCase();
        output = cp.execSync(`fsutil volume diskfree ${driveOrMount}:`, options);
    } else {
        output = cp.execSync(`df -P ${driveOrMount} | awk 'NR==2 {print $4}'`, options);
    }

    if (output.length === 0) {
        throw new Error('Failed to read free space');
    }
    return getBytesFromOutput(output);
};