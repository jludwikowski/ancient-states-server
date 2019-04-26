/* Divinding api into 2 section due to plans of having a lot of actions. This is just for clariy */
import playerActions from '../doActions';

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
