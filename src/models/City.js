module.exports = {
    identity: 'city',
    primaryKey: 'id',
    attributes: {
        id: { type: 'number', autoMigrations: { autoIncrement: true } },
        owner: { model: 'user' },
        barracksLevel: { type: 'number', required: true },
        forgeLevel: { type: 'number', required: true },
        fieldsLevel: { type: 'number', required: true },
        wallLevel: { type: 'number', required: true },
        position: { type: 'string', required: true },
    },
};
