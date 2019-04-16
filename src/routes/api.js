module.exports = {
    method: 'GET',
    path: '/api',
    handler: async (request, responseToolkit) => {
        try {
            return responseToolkit.response({
                mockObject: 'mock',
            }).code(200);
        } catch (err) {
            return responseToolkit.response({
                statusCode: 500,
                error: 'Server Error',
                message: 'Server Error. Security reasons do not allow us to display it. Please contact administrator',
            }).code(500);
        }
    },
    options: {
        auth: false,
    },
};
