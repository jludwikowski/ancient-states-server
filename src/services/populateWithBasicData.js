module.exports = {
/* This is hardcoded basic data that we must make sure will be in DB and it will be newest version */

    async populateBaseBuildings(waterline) {
        await waterline.models.basebuilding.destroy({ id: { '>': 0 } });

        const basicBuildings = [{
            id: 1,
            name: 'Barracks',
            baseCost: 100,
            baseBuildingTime: 120,
            imageUrl: 'images/icons/icons8-military-base-100.png',
            description: 'You recruit standard units here',
        }, {
            id: 2,
            name: 'Forge',
            baseCost: 250,
            baseBuildingTime: 150,
            imageUrl: 'images/icons/icons8-military-base-100.png',
            description: 'This building let you upgrade weapons',
        }, {
            id: 3,
            name: 'Fields',
            baseCost: 60,
            baseBuildingTime: 150,
            imageUrl: 'images/icons/icons8-military-base-100.png',
            description: 'This building produce food',
        }, {
            id: 4,
            name: 'Wall',
            baseCost: 100,
            baseBuildingTime: 150,
            imageUrl: 'images/icons/icons8-military-base-100.png',
            description: 'Increase your defences',
        }];

        await waterline.models.basebuilding.createEach(basicBuildings);
    },

    async populateBaseUnits(waterline) {
        await waterline.models.baseunit.destroy({ id: { '>': 0 } });

        const baseUnits = [{
            id: 1,
            name: 'Tribal Warriors',
            description: 'Strongest men of the tribe armed with clubs and spears',
            baseTrainTime: 100,
            baseDamage: 11,
            baseCost: 50,
            activeTurns: '[6, 7, 8, 9, 10, 11, 12]',
            baseHealth: 40,
            type: 'Melee',
            imageUrl: 'images/icons/icons8-military-base-100.png',
        }, {
            id: 2,
            name: 'Peasant',
            description: 'Just Peasant armed with whatever he had on hands',
            baseTrainTime: 30,
            baseDamage: 4,
            baseCost: 20,
            activeTurns: '[6, 7, 8, 9, 10, 11, 12]',
            baseHealth: 20,
            type: 'Melee',
            imageUrl: 'images/icons/icons8-military-base-100.png',
        }];

        await waterline.models.baseunit.createEach(baseUnits);
    },

    async repopulateAll(waterline) {
        await Promise.all([
            this.populateBaseBuildings(waterline),
            this.populateBaseUnits(waterline),
        ]);
    },


}
