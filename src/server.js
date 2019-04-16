import Hapi from 'hapi';
import HapiWaterline from 'hapi-waterline';
import diskAdapter from 'sails-disk';
import apiRoute from './routes/api';

const server = new Hapi.Server({
    host: 'localhost',
    port: 7777,
});

async function reginsterWaterline() {
    const options = {
        adapters: {
            'disk-adapter': diskAdapter,
        },
        datastores: {
            default: {
                adapter: 'disk-adapter',
            },
        },
        models: {
            datatstore: 'default',
            migrate: 'alter',
        },
        decorateServer: true, // decorate server by method - getModel
        path: ['../../../src/models'],
    };

    await server.register({
        plugin: HapiWaterline,
        options,
    });
}

async function start() {
    try {
        await reginsterWaterline();
        server.route(apiRoute);
        await server.start();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    console.log('Server running at: ', server.info.uri);
}

start()

module.exports = server;
