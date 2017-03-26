import test from 'ava';
import freespace from './index';

test('async', async t => {
    let driveOrMount = process.platform === 'win32' ? 'c' : '/';
    t.is(typeof await freespace.check(driveOrMount), 'number');
});

test('sync', t => {
    let driveOrMount = process.platform === 'win32' ? 'c' : '/';
    t.is(typeof freespace.checkSync(driveOrMount), 'number');
});

test('wrong path', t => {
   ['/esfnief', '/esgni/esfnin'].map(input => {
       const error = t.throws(() => freespace.checkSync(input));
       t.is(error.message, 'Failed to read free space');
   })
});

test('invalid input', t => {
    ['ocv:', true, '', {}, 34].map(input => {
        const error = t.throws(() => freespace.checkSync(input));
        t.is(error.message, 'driveOrMount is invalid');
    })
});