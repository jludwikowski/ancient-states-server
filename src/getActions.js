/* Here we have all actions for now. We might divide it later into semantic sections/files */
import calculator from './calculator';

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
            case 'Rules':
                return true;
            default:
                return false;
        }
    },

    getBaseBuildings() {
        return this.waterline.models.basebuilding.find();
    },

    getBaseUnits() {
        return this.waterline.models.baseunit.find();
    },

    async getPlayer(query) {
        return (await this.waterline.models.user.find({ id: query.id })
            .populate('city')
            .populate('armies')
            .populate('resources')
        )[0];
    },

    async getArmy(query) {
        return (await this.waterline.models.army.find({ id: query.id })
            .populate('units')
        )[0];
    },

    async getPlayerArmies(query) {
        return this.waterline.models.army.find({ owner: query.id })
            .populate('units');
    },

    getRules() {
        return calculator.rules;
    },

};
