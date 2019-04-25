module.exports = {

    rules: {
        BuildingUpgradePriceStep: 1.4,
        BuildingUpgradeTimeStep: 1.5,
    },

    calculateBuildingPrice(buildingBasePrice, newLevel) {
        return Math.floor((this.rules.BuildingUpgradePriceStep ** newLevel) * buildingBasePrice);
    },

    calculateBuildingTime(buildingBaseTime, newLevel) {
        return Math.floor((this.rules.BuildingUpgradeTimeStep ** newLevel) * buildingBaseTime);
    },
};
