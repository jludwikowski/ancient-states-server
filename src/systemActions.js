module.exports = {

    initialize(waterline) {
        this.waterline = waterline;
    },

    async reduceArmy(targetArmy, reduceArmyObject) {
        const promiseArray = [];
        await targetArmy.units.forEach(async (targetUnit) => {
            const reduceUnit = reduceArmyObject.units.find(
                unit => targetUnit.baseUnit === unit.baseUnit
                    && targetUnit.number >= unit.number
                    && targetUnit.level === unit.level
            );
            if (reduceUnit) {
                promiseArray.pop(
                    await this.waterline.models.unit.updateOne({ id: targetUnit.id })
                        .set({
                            number: targetUnit.number - reduceUnit.number,
                        })
                );
            }
        });
        await Promise.all(promiseArray);
    },

};
