module.exports = {
    identity: 'city',
    primaryKey: 'id',
    attributes: {
        id: { type: 'number', autoMigrations: { autoIncrement: true } },
        owner: { model: 'user' },
        numberOfMen: { type: 'number', defaultsTo: 100 },
        numberOfWomen: { type: 'number', defaultsTo: 100 },
        numberOfSlaves: { type: 'number', defaultsTo: 0 },
        description: { type: 'string', defaultsTo: '' },
        constructing: { type: 'string', allowNull: true },
        constructionTimeLeft: { type: 'number', allowNull: true },
        barracksLevel: { type: 'number', required: true },
        forgeLevel: { type: 'number', required: true },
        fieldsLevel: { type: 'number', required: true },
        wallLevel: { type: 'number', required: true },
        position: { type: 'string', required: true },
    },
};
