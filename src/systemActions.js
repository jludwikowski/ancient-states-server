import playerActions from "./doActions";

module.exports = {

    initialize(waterline) {
        this.waterline = waterline;
    },

    async reduceArmy(sourceArmy, reduceArmyObject) {
        const promiseArray = [];
        let promise = null;
        await sourceArmy.units.forEach(async (sourceUnit) => {
            const reduceUnit = reduceArmyObject.units.find(
                unit => sourceUnit.baseUnit === unit.baseUnit
                    && sourceUnit.number >= unit.number
                    && sourceUnit.level === unit.level
            );
            if (reduceUnit) {
                if (sourceUnit.number - reduceUnit.number === 0) {
                    promise = await this.waterline.models.unit.destroy({ id: sourceUnit.id });
                } else {
                    promise = await this.waterline.models.unit.updateOne({ id: sourceUnit.id })
                        .set({
                            number: sourceUnit.number - reduceUnit.number,
                        });
                }
                promiseArray.pop(promise);
            }
        });
        await Promise.all(promiseArray);
    },

    async reinforceArmy(armyObject, targetArmy) {
        const promiseUpdateArray = [];
        const createArray = [];
        await armyObject.units.forEach(async (reinforceUnit) => {
            const unitAlreadyExists = targetArmy.units.find(
                targetUnit => targetUnit.baseUnit === reinforceUnit.baseUnit
                    && targetUnit.level === reinforceUnit.level
            );
            if (unitAlreadyExists) {
                promiseUpdateArray.pop(await this.waterline.models.unit.updateOne({ id: unitAlreadyExists.id })
                    .set({
                        number: unitAlreadyExists.number + reinforceUnit.number,
                    }));
            } else {
                createArray.pop(reinforceUnit);
            }
            await Promise.all([
                await this.waterline.models.unit.createEach(createArray),
                await this.waterline.models.unit.destroy({ army: armyObject.id }),
                ...promiseUpdateArray,
            ]);
        });
    },
};
