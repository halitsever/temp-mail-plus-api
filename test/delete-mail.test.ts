import { test, describe, type TestContext } from 'node:test';
import assert from 'node:assert';
import HttpClient from '../src/http.client';
import TempMail from '../src/index';

const mockDeleteSuccess = { result: true };

describe('TempMail.deleteMailById()', () => {
    test('should return success on valid delete', async (t: TestContext) => {
        t.mock.method(HttpClient.prototype, 'delete', async () => mockDeleteSuccess);

        const tempMail = new TempMail('halit@rover.info');
        const result = await tempMail.deleteMailById(123);

        assert.strictEqual(result.success, true);
        assert.strictEqual(result.result, true);
    });

    test('should return success: false on API error', async (t: TestContext) => {
        t.mock.method(HttpClient.prototype, 'delete', async () => {
            throw new Error('Unauthorized');
        });

        const tempMail = new TempMail('halit@rover.info');
        const result = await tempMail.deleteMailById(123);

        assert.strictEqual(result.success, false);
        assert.strictEqual(result.error, 'Unauthorized');
    });
});

