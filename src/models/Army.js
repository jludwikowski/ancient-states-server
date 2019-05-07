module.exports = {
    identity: 'army',
    primaryKey: 'id',
    attributes: {
        id: { type: 'number', autoMigrations: { autoIncrement: true } },
        name: { type: 'string', defaultsTo: 'New Army' },
        description: { type: 'string', defaultsTo: '' },
        owner: { model: 'user' },
        units: {
            collection: 'unit',
            via: 'army',
        },
        status: { type: 'string', defaultsTo: 'camp' },
        orderDate: { type: 'string', allowNull: true },
        targetId: { type: 'number', allowNull: true },
        position: { type: 'string', required: true },
    },
};
