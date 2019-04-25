module.exports = {
    identity: 'resources',
    primaryKey: 'id',
    attributes: {
        id: { type: 'number', autoMigrations: { autoIncrement: true } },
        owner: { model: 'user', required: true },
        food: { type: 'number', required: true },
        iron: { type: 'number', required: true },
        timber: { type: 'number', required: true },
        stone: { type: 'number', required: true },
        gold: { type: 'number', required: true },
        influence: { type: 'number', required: true },
    },
};
