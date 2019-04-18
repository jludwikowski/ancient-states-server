module.exports = {
    identity: 'user',
    primaryKey: 'id',
    attributes: {
        id: { type: 'number', autoMigrations: { autoIncrement: true } },
        name: { type: 'string', required: true },
        email: { type: 'string', required: true },
        city: { model: 'city', required: true },
        armies: {
            collection: 'army',
            via: 'owner',
        },
    },
};
