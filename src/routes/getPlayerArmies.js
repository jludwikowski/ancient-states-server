import playerActions from '../getActions';
import Joi from "@hapi/joi";

/* This is only for managing request and responces */
module.exports = {
    method: 'GET',
    path: '/api/players/{id}/armies',
    handler: async (request, responseToolkit) => {
        try {
            return playerActions.fetchData('PlayerArmies', request.params.id);
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
        description: 'Get armies for selected player',
        notes: 'Returns collection of army objects',
        tags: ['api'],
        validate: {
            params: {
                id: Joi.string().required().example('1'),
            },
        },
    },
};
