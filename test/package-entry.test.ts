import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(__dirname, '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

/** Runs the packed tarball, so it needs `npm run build` first. */
describe('packed package entry', () => {
    let dir: string;
    let pkg: string;

    before(() => {
        assert.ok(existsSync(join(root, 'dist/src/index.js')), 'run `npm run build` before the tests');
        dir = mkdtempSync(join(tmpdir(), 'temp-mail-plus-api-'));
        const tarball = execFileSync(npm, ['pack', '--silent', '--pack-destination', dir], { cwd: root, encoding: 'utf8' }).trim().split('\n').pop()!;
        pkg = join(dir, 'node_modules', 'temp-mail-plus-api');
        mkdirSync(pkg, { recursive: true });
        execFileSync('tar', ['-xzf', join(dir, tarball), '-C', pkg, '--strip-components=1']);
        // Lets the extracted package resolve axios without a network install.
        symlinkSync(join(root, 'node_modules'), join(pkg, 'node_modules'), 'dir');
    });

    after(() => {
        if (dir) rmSync(dir, { recursive: true, force: true });
    });

    const run = (args: string[]) => execFileSync(process.execPath, args, { cwd: dir, encoding: 'utf8' }).trim();

    test('ESM default and named imports work', () => {
        const out = run([
            '--input-type=module',
            '-e',
            `import TempMail, { TEMP_MAIL_DOMAINS } from 'temp-mail-plus-api';
            console.log(typeof TempMail.generateEmail, Array.isArray(TEMP_MAIL_DOMAINS), TEMP_MAIL_DOMAINS === TempMail.TEMP_MAIL_DOMAINS);`,
        ]);
        assert.strictEqual(out, 'function true true');
    });

    test('require() returns the class with TEMP_MAIL_DOMAINS attached', () => {
        const out = run([
            '-e',
            `const TempMail = require('temp-mail-plus-api');
            console.log(TempMail.name, typeof TempMail.generateEmail, Array.isArray(TempMail.TEMP_MAIL_DOMAINS));`,
        ]);
        assert.strictEqual(out, 'TempMailInstance function true');
    });
});
