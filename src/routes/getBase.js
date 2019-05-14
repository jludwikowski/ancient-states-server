import playerActions from '../getActions';

/* This is only for managing request and responces */
module.exports = {
    method: 'GET',
    path: '/api/base-entities/{entity}',
    handler: async (request, responseToolkit) => {
        try {
            if (playerActions.isValidFecthAction(request.params.entity)) {
                return playerActions.fetchData(request.params.entity, request.query);
            }
            /* Invalid api call */
            return responseToolkit.response({
                error: 'Not Found',
                message: 'This is not the endpoint you are looking for',
                statusCode: 404,
            }).code(404);
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
