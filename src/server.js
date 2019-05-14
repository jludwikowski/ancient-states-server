import Hapi from 'hapi';
import HapiWaterline from 'hapi-waterline';
import routes from './routes';
import startState from './services/baseData';
import getActions from './getActions';
import doActions from './doActions';
import systemActions from './systemActions';
import config from '../config';

/* For now all options are hardcoded. This will move to config file */
const server = new Hapi.Server({
    routes: {
        cors: {
            origin: ['*'],
            additionalExposedHeaders: ['Accept'],
        },
    },
    ...config.server,
});

async function registerWaterline() {
    const options = Object.assign({
        models: {
            datatstore: 'default',
            migrate: 'alter',
        },
        decorateServer: true,
        path: ['../../../src/models'],
    }, config.waterlineOptions);

    await server.register({
        plugin: HapiWaterline,
        options,
    }, { once: true });

    /* Initialize data and components that will work with waterline */
    await startState.repopulateAll(server.plugins['hapi-waterline']);
    getActions.initialize(server.plugins['hapi-waterline']);
    doActions.initialize(server.plugins['hapi-waterline']);
    systemActions.initialize(server.plugins['hapi-waterline']);
}

async function serverSetup() {
    await registerWaterline();
    server.route(routes);
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
