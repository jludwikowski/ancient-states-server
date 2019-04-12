module.exports = {
    attributes: {
        id: { type: 'number', required: true },
        name: { type: 'string', required: true },
        description: { type: 'string', required: true },
        baseBuildingTime: { type: 'number', required: true },
        baseCost: { type: 'number', required: true },
        imageUrl: { type: 'string', required: false },
    },
};
