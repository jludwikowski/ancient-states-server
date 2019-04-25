/* Here we have all actions for now. We might divide it later into semantic sections/files */
import calculator from './calculator';
import baseData from './services/baseData';

module.exports = {

    initialize(waterline) {
        this.waterline = waterline;
    },

    async fetchData(action, payload) {
        /* Decide what needs to be cached here and how */
        return this[`get${action}`](payload);
    },

    isValidFecthAction(action) {
        switch (action) {
            case 'PlayerBuildings':
                return true;
            case 'PlayerArmies':
                return true;
            case 'BaseBuildings':
                return true;
            case 'BaseUnits':
                return true;
            case 'Player':
                return true;
            default:
                return false;
        }
    },

    isValidPostAction(action) {
        switch (action) {
            case 'UpgradeBuilding':
                return true;
            case 'CreatArmy':
                return true;
            case 'DestroyArmy':
                return true;
            default:
                return false;
        }
    },

    getBaseBuildings() {
        return this.waterline.models.baseunit.find();
    },

    getBaseUnits() {
        return this.waterline.models.basebuilding.find();
    },

    async upgradeBuilding(query) {
        const playerWithCity = (await this.getPlayer({ id: query.userId }));
        const baseBuilding = baseData.baseBuildings[query.buildingId - 1];

        const newLevel = playerWithCity.city[`${baseBuilding.name}Level`] + 1;
        const price = calculator.calculateBuildingPrice(baseBuilding.baseCost, newLevel);
        const time = calculator.calculateBuildingTime(baseBuilding.baseBuildingTime, newLevel);
        if (this.canAfford(price, playerWithCity) && !this.cityIsConstructing(playerWithCity)) {
            await Promise.all([
            /* set up construction flag */
                this.waterline.models.city.updateOne({ id: playerWithCity.city.id })
                    .set({
                        constructing: baseBuilding.name,
                        constructionTimeLeft: time,
                    }),
                /* deduct funds */
                this.waterline.models.resources.updateOne({ id: playerWithCity.city.id })
                    .set({
                        gold: playerWithCity.resources.gold - price,
                    }),
            ]);
            return this.getPlayer({ id: query.userId });
        }
        return false;
    },

    async getPlayer(query) {
        return (await this.waterline.models.user.find({ id: query.id })
            .populate('city')
            .populate('armies')
            .populate('resources')
        )[0];
    },

    /* Helper checking if player can afford action. Double check after clinet app just in case */
    canAfford(price, player) {
        return player.resources.gold >= price;
    },

    /* Helper checking if player is not already building something */
    cityIsConstructing(player) {
        if (player.city.constructing) {
            return true;
        }
        return false;
    },

};
