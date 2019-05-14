import playerActions from '../getActions';

/* This is only for managing request and responces */
module.exports = {
    method: 'GET',
    path: '/api/players/{id}',
    handler: async (request, responseToolkit) => {
        try {
            return playerActions.fetchData('Player', request.query);
        } catch (err) {
            /* We won't pass exact error due to security reasons */
            return responseToolkit.response({
                statusCode: 500,
                error: 'Server Error',
                message: 'Server Error. Please contact administrator',
            }).code(500);
        }
    },
    options: {
        auth: false,
    },
};
