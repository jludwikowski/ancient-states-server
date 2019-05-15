import Joi from '@hapi/joi';
import playerActions from '../doActions';

const unitRef = Joi.object({
    baseUnit: Joi.number().required().example(1),
    level: Joi.number().required().example(4),
    number: Joi.number().required().example(99),
});

/* This is only for managing request and responses */
module.exports = {
    method: 'POST',
    path: '/api/players/{id}/armies',
    config: {
        handler: async (request, responseToolkit) => {
            try {
                return playerActions.runAction('CreateArmy', request.payload, request.params.id);
            } catch (err) {
                /* We won't pass exact error due to security reasons */
                return responseToolkit.response({
                    statusCode: 500,
                    error: 'Server Error',
                    message: 'Server Error. Please contact administrator',
                }).code(500);
            }
        },
        description: 'Creates new army for a player',
        notes: 'Returns an army entity with proper ids',
        tags: ['api'],
        validate: {
            payload: Joi.object({
                name: Joi.string().required().example('New Army'),
                description: Joi.string().required().example('any'),
                owner: Joi.number().required().example(1),
                status: Joi.string().required().example('camp'),
                orderDate: Joi.string(),
                targetId: Joi.number(),
                position: Joi.string().required().example('0,0'),
                commander: Joi.number(),
                units: Joi.array().items(unitRef),
            }),
            params: {
                id: Joi.string().required(),
            },
        },
        auth: false,
    },
};
