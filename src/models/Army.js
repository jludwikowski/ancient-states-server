module.exports = {
    identity: 'army',
    primaryKey: 'id',
    attributes: {
        id: { type: 'number', autoMigrations: { autoIncrement: true } },
        name: { type: 'string', defaultsTo: 'New Army' },
        owner: { model: 'user' },
        units: {
            collection: 'unit',
            via: 'army',
        },
        position: { type: 'string', required: true },
    },
};
