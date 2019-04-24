import Hapi from 'hapi';
import HapiWaterline from 'hapi-waterline';
import diskAdapter from 'sails-disk';
import getApiRoute from './routes/fetchApi';
import postApiRoute from './routes/postApi';
import startState from './services/populateWithBasicData';
import playerActions from './playerActions';

/* For now all options are hardcoded. This will move to config file */
const server = new Hapi.Server({
    host: 'localhost',
    port: 7777,
});

async function registerWaterline() {
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
        decorateServer: true,
        path: ['../../../src/models'],
    };

    await server.register({
        plugin: HapiWaterline,
        options,
    }, { once: true });

    /* Initialize data and components that will work with waterline */
    await startState.repopulateAll(server.plugins['hapi-waterline']);
    playerActions.initialize(server.plugins['hapi-waterline']);
}

async function serverSetup() {
    await registerWaterline();
    server.route(getApiRoute, postApiRoute);
}

exports.init = async () => {
    if (!server || !server.plugins['hapi-waterline']) {
        await serverSetup();
    }
    await server.initialize();
    return server;
};

exports.start = async () => {
    try {
        await serverSetup();
        await server.start();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Server running at: ', server.info.uri);
    return server;
};
