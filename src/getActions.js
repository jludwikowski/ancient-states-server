/* Here we have all actions for now. We might divide it later into semantic sections/files */
import calculator from './calculator';

module.exports = {

    initialize(waterline) {
        this.waterline = waterline;
    },

    async fetchData(action, payload) {
        /* Decide what needs to be cached here and how */
        const actionName = action.charAt(0).toUpperCase() + action.slice(1);
        return this[`get${actionName}`](payload);
    },

    isValidFecthAction(action) {
        switch (action) {
            case 'buildings':
                return true;
            case 'units':
                return true;
            case 'rules':
                return true;
            default:
                return false;
        }
    },

    getBuildings() {
        return this.waterline.models.basebuilding.find();
    },

    getUnits() {
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

    async getPlayerArmies(id) {
        return this.waterline.models.army.find({ owner: id })
            .populate('units');
    },

    getRules() {
        return calculator.rules;
    },

};
