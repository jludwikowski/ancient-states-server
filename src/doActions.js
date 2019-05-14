import baseData from './services/baseData';
import calculator from './calculator';
import getActions from './getActions';
import systemActions from './systemActions';

module.exports = {

    initialize(waterline) {
        this.waterline = waterline;
    },

    isValidPostAction(action) {
        switch (action) {
            case 'UpgradeBuilding':
                return true;
            case 'CreateArmy':
                return true;
            case 'DisbandArmy':
                return true;
            default:
                return false;
        }
    },

    async runAction(action, payload, userId) {
        /* Just for consistency and easy run with postApi */
        return this[`do${action}`](payload, userId);
    },

    async doUpgradeBuilding(query) {
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

    async doCreateArmy(army, userId) {
        if (userId !== army.owner.toString()) {
            return { error: 'Invalid User' };
        }
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

        const player = await getActions.getPlayer({ id: army.ownerId });
        const garrison = await getActions.getArmy({ id: player.armies[0].id });
        /* set position and other defaults if needed const newArmy = objectAssign() */

        if (hasEnoughMen(army, garrison)) {
            try {
                const { units, ...armyWithoutUnits } = army;
                const newArmy = await this.waterline.models.army.create(armyWithoutUnits).fetch();
                units.forEach(unit => Object.assign(unit, { army: newArmy.id }));
                await this.waterline.models.unit.createEach(units);
                newArmy.units = units;
                await systemActions.reduceArmy(garrison, newArmy);
                return newArmy;
            } catch (error) {
                /* This is for early development so we know what happened. this will only show on server console */
                console.log(error);
            }
        }
        return { error: 'Cannot create new army' };
    },

    async doDisbandArmy(army) {
        const player = (await getActions.getPlayer({ id: army.owner }));
        const garrison = await getActions.getArmy({ id: player.armies[0].id });

        if (army.position !== garrison.position) {
            return { error: 'Cannot disband army away from capital' };
        }
        Promise.all([
            await systemActions.reinforceArmy(army, garrison),
            await systemActions.reduceArmy(army, army),
            await this.waterline.models.army.destroy({ id: army.id }),
        ]);
        return { message: `army ${army.id} disbanded` };
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
