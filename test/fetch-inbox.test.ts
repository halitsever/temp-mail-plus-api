import { test, describe, type TestContext } from 'node:test';
import assert from 'node:assert';
import HttpClient from '../src/http.client';
import TempMail from '../src/index';

const mockMailItem = {
    attachment_count: 0,
    first_attachment_name: '',
    from_mail: 'sender@example.com',
    from_name: 'Sender',
    is_new: true,
    mail_id: 123,
    subject: 'Hello',
    time: '2024-01-01T00:00:00Z'
};

const mockInboxData = {
    count: 1,
    first_id: 123,
    last_id: 123,
    limit: 10,
    mail_list: [mockMailItem],
    more: false,
    result: true
};

describe('TempMail.fetchInbox()', () => {
    test('should return inbox data on success', async (t: TestContext) => {
        t.mock.method(HttpClient.prototype, 'get', async () => mockInboxData);

        const tempMail = new TempMail('halit@rover.info');
        const inbox = await tempMail.fetchInbox();

        assert.strictEqual(inbox.success, true);
        assert.strictEqual(inbox.error, null);
        assert(Array.isArray(inbox.mail_list), 'mail_list should be an array');
        assert.strictEqual(inbox.mail_list!.length, 1);
        assert.strictEqual(inbox.mail_list![0].subject, 'Hello');
        assert.strictEqual(inbox.result, true);
    });

    test('should return success: false on network error', async (t: TestContext) => {
        t.mock.method(HttpClient.prototype, 'get', async () => {
            throw new Error('Network error');
        });

        const tempMail = new TempMail('halit@rover.info');
        const inbox = await tempMail.fetchInbox();

        assert.strictEqual(inbox.success, false);
        assert.strictEqual(inbox.error, 'Network error');
    });
});

describe('TempMail.fetchMailById()', () => {
    test('should return mail data on success', async (t: TestContext) => {
        const mockMailData = {
            attachments: [],
            date: new Date('2024-01-01'),
            from: 'Sender <sender@example.com>',
            from_is_local: false,
            from_mail: 'sender@example.com',
            from_name: 'Sender',
            html: '<p>Hello</p>',
            is_tls: true,
            mail_id: 123,
            message_id: 'msg-123',
            result: true,
            subject: 'Hello',
            text: 'Hello',
            to: 'halit@rover.info'
        };

        t.mock.method(HttpClient.prototype, 'get', async () => mockMailData);

        const tempMail = new TempMail('halit@rover.info');
        const mail = await tempMail.fetchMailById(123);

        assert.strictEqual(mail.success, true);
        assert.strictEqual(mail.subject, 'Hello');
        assert.strictEqual(mail.from_mail, 'sender@example.com');
    });

    test('should return success: false on error', async (t: TestContext) => {
        t.mock.method(HttpClient.prototype, 'get', async () => {
            throw new Error('Not found');
        });

        const tempMail = new TempMail('halit@rover.info');
        const mail = await tempMail.fetchMailById(999);

        assert.strictEqual(mail.success, false);
        assert.strictEqual(mail.error, 'Not found');
    });
});

describe('TempMail email validation', () => {
    test('should throw on invalid email', () => {
        assert.throws(
            () => new TempMail('invalid-email'),
            /Invalid email address/
        );
    });

    test('setEmail should throw on invalid email', () => {
        const tempMail = new TempMail('halit@rover.info');
        assert.throws(
            () => tempMail.setEmail('bad'),
            /Invalid email address/
        );
    });
});
