# freespace README #
A library that tells you how much free disk space you have.
* Works on all platform.
* No dependencies and no native libraries.

## How do I get set up?

`npm install --save freespace`

## API

### check(driveOrMount, [callback])

#### driveOrMount
Type `String`

The drive letter (for window) or mount point (for *nix) you want to check

#### callback - optional
Type `function`

callback function with signture `function(err, bytes)`
* **err** - `Error` An error that occured, otherwise `null`
* **bytes** - `number` The number of bytes available

#### returns
**Promise** - Resolves with the number of bytes available

### checkSync(driveOrMount)

#### driveOrMount
Type `String`

The drive letter (for window) or mount point (for *nix) you want to check

#### returns
**bytes** - `number` The number of bytes available

*Thie function throws on error*


## Usage

````
const freespace = require('freespace');

freespace.check('/')
.then(bytes => {
    console.log(bytes);
})
.catch(e => {
    console.error(e);
});

freespace.check('c', (err, bytes) => {
    if (err) {
        console.error(err);
    } else {
        console.log(bytes);
    }
});

try {
    let bytes = freespace.checkSync('d:');
    console.log(bytes);
} catch (e) {
    console.error(e);
}

````
