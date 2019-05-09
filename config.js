import diskAdapter from 'sails-disk';

export const env = process.env.NODE_ENV || 'dev';

const config = {
    dev: {
        server: {
            host: 'localhost',
            port: 7777,
        },
        waterlineOptions: {
            adapters: {
                'disk-adapter': diskAdapter,
            },
            datastores: {
                default: {
                    adapter: 'disk-adapter',
                },
            },
        },
    },
    test: {
        server: {
            host: 'localhost',
            port: 7777,
        },
        waterlineOptions: {
            adapters: {
                'disk-adapter': diskAdapter,
            },
            datastores: {
                default: {
                    adapter: 'disk-adapter',
                },
            },
        },
    },
};

export default config[env];
