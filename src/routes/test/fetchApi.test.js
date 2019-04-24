import { init } from '../../server';

let server = {};

beforeAll(async () => {
    server = await init();
});

test('basic player data fetch', async () => {
    const injectOptions = {
        method: 'GET',
        url: '/api/get/Player?id=1',
    };
    const response = await server.inject(injectOptions);

    expect(response.statusCode).toBe(200);
}, 20000);

test('basic player data fetch', async () => {
    const injectOptions = {
        method: 'GET',
        url: '/api/get/BaseUnits',
    };
    const response = await server.inject(injectOptions);

    expect(response.statusCode).toBe(200);
}, 20000);
