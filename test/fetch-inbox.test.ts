import { test, describe } from 'node:test';
import assert from 'node:assert';
import TempMail from '../src/index';

describe('TempMail API Tests', () => {
    const tempMail = new TempMail("halit@rover.info");
    test('fetchInbox should return an array of emails', async () => {
        const inbox = await tempMail.fetchInbox();
        assert(Array.isArray(inbox.mail_list), 'Inbox should be an array');
        assert(inbox.success, 'Inbox fetch should be successful');
        assert(inbox.result, 'Inbox result should be true');
    });
});

