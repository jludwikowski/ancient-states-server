import baseData from './services/baseData';
import calculator from './calculator';
import getActions from './getActions';
import systemAcrions from './systemActions';

module.exports = {

    initialize(waterline) {
        this.waterline = waterline;
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

    async runActions(action, payload) {
        /* Just for consistency and easy run with postApi */
        return this[`do${action}`](payload);
    },

    async UpgradeBuilding(query) {
        const playerWithCity = (await getActions.getPlayer({ id: query.userId }));
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
            return getActions.getPlayer({ id: query.userId });
        }
        return { error: `Cannot upgrade building ${baseBuilding.name}` };
    },

    async CreateArmy(army) {
        /* Check if army has enough men of this unit type */
        const hasValidUnit = (newUnit, targetArmy) => targetArmy.units.find(
            targetUnit => targetUnit.baseUnit === newUnit.baseUnit
                && targetUnit.number >= newUnit.number
                && targetUnit.level === newUnit.level
        );

        /* Check if your target army has enough men for new one */
        const hasEnoughMen = (newArmy, targetArmy) => newArmy.units.every(
            newUnit => hasValidUnit(newUnit, targetArmy)
        );

        const playerWithArmies = await getActions.getPlayer({ id: army.ownerId });
        const garrison = await getActions.getArmy({ id: playerWithArmies.armies[0].id });
        /* set position and other defaults if needed const newArmy = objectAssign() */

        if (hasEnoughMen(army, garrison)) {
            const { units, ...armyWithoutUnits } = army;
            const newArmy = await this.waterline.models.army.create(armyWithoutUnits).fetch();
            units.forEach(unit => Object.assign(unit, { army: newArmy.id }));
            await this.waterline.models.unit.createEach(units);
            newArmy.units = units;
            await systemAcrions.reduceArmy(garrison, newArmy);
            return newArmy;
        }
        return { error: 'Cannot create new army' };
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
