import Hapi from 'hapi';
import HapiWaterline from 'hapi-waterline';
import diskAdapter from 'sails-disk';
import getApiRoute from './routes/fetchApi';
import postApiRoute from './routes/postApi';
import startState from './services/populateWithBasicData';
import playerActions from './playerActions';

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

    /* Initialize data and components that will work with waterline */
    await startState.repopulateAll(server.plugins['hapi-waterline']);
    playerActions.initialize(server.plugins['hapi-waterline']);
}

async function start() {
    try {
        await reginsterWaterline();
        server.route(getApiRoute, postApiRoute);
        await server.start();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    console.log('Server running at: ', server.info.uri);
}

start()

module.exports = server;
