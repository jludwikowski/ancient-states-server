import playerActions from '../playerActions';

/* This is only for managing request and responces */
module.exports = {
    method: 'POST',
    path: '/api/do/{action}',
    handler: async (request, responseToolkit) => {
        try {
            if (playerActions.isValidPostAction(request.params.action)) {
                return responseToolkit.response({
                    mockObject: 'mock',
                }).code(200);
            }
            /* Invalid api call */
            return responseToolkit.response({
                error: 'Not Found',
                message: 'This is not the endpoint you are looking for',
                code: 404,
            }).code(404);
        } catch (err) {
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
