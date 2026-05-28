import { test, describe } from 'node:test';
import assert from 'node:assert';
import TempMail, { TEMP_MAIL_DOMAINS, TempMailDomain } from '../src/index';

describe('TempMailInstance.generateEmail()', () => {
    test('should return a valid email object with all fields', () => {
        const result = TempMail.generateEmail();

        assert.ok(result.email, 'email should not be empty');
        assert.ok(result.username, 'username should not be empty');
        assert.ok(result.domain, 'domain should not be empty');
        assert.strictEqual(result.email, `${result.username}@${result.domain}`);
    });

    test('generated email should use a supported domain', () => {
        const result = TempMail.generateEmail();
        const domains: readonly string[] = TEMP_MAIL_DOMAINS;

        assert.ok(
            domains.includes(result.domain),
            `domain "${result.domain}" should be in TEMP_MAIL_DOMAINS`
        );
    });

    test('should use provided username', () => {
        const result = TempMail.generateEmail('halit');

        assert.strictEqual(result.username, 'halit');
        assert.strictEqual(result.email, `halit@${result.domain}`);
    });

    test('should use provided domain', () => {
        const result = TempMail.generateEmail(undefined, 'rover.info' as TempMailDomain);

        assert.strictEqual(result.domain, 'rover.info');
        assert.ok(result.email.endsWith('@rover.info'));
    });

    test('should use both provided username and domain', () => {
        const result = TempMail.generateEmail('halit', 'fexpost.com' as TempMailDomain);

        assert.strictEqual(result.email, 'halit@fexpost.com');
        assert.strictEqual(result.username, 'halit');
        assert.strictEqual(result.domain, 'fexpost.com');
    });

    test('random username should be 8 characters of alphanumeric', () => {
        const result = TempMail.generateEmail();

        assert.match(result.username, /^[a-z0-9]{8}$/);
    });

    test('two calls without arguments should produce different usernames', () => {
        const first = TempMail.generateEmail();
        const second = TempMail.generateEmail();

        // extremely unlikely to collide on 8-char alphanumeric
        assert.notStrictEqual(first.email, second.email);
    });
});
