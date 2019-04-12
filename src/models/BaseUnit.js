module.exports = {
    attributes: {
        id: { type: 'number', required: true },
        name: { type: 'string', required: true },
        description: { type: 'string', required: true },
        baseTrainTime: { type: 'number', required: true },
        baseDamage:  { type: 'number', required: true },
        baseHealth: { type: 'number', required: true },
        baseCost: { type: 'number', required: true },
        activeTurns: { type: 'string', required: true },
        type: { type: 'string', required: true },
        imageUrl: { type: 'string', required: false },
    },
};
