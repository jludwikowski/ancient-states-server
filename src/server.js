import Hapi from 'hapi';

const server = new Hapi.Server({
    host: 'localhost',
    port: 7777,
});

/* Obviously to be removed */
server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return 'Hello There. General Kanobi!';
    },
});

async function start () {
    // start your server
    try {
        await server.start();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    console.log('Server running at: ', server.info.uri);
}

start()
