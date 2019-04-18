/* Here we have all actions for now. We might divide it later into semantic sections/files */
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

    getPlayer(query) {
        return this.waterline.models.user.find({ id: query.id }).populate('city').populate('armies');
    },

};
