module.exports = {
    identity: 'baseBuilding',
    primaryKey: 'id',
    attributes: {
        id: { type: 'number', autoMigrations: { autoIncrement: true } },
        name: { type: 'string', required: true },
        description: { type: 'string', required: true },
        baseBuildingTime: { type: 'number', required: true },
        baseCost: { type: 'number', required: true },
        imageUrl: { type: 'string', required: false },
    },
};
