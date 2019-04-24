import { init } from '../../server';

test('basic player data fetch', async () => {
    const server = await init();
    const injectOptions = {
        method: 'GET',
        url: '/api/get/Player?id=1',
    };
    const response = await server.inject(injectOptions);

    expect(response.statusCode).toBe(200);
}, 20000);
