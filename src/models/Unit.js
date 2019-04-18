module.exports = {
    identity: 'unit',
    primaryKey: 'id',
    attributes: {
        id: { type: 'number', autoMigrations: { autoIncrement: true } },
        baseUnit: { model: 'baseUnit', required: true },
        number: { type: 'number', required: true },
        level: { type: 'number', required: true },
        army: { model: 'army', required: true },
    },
};
