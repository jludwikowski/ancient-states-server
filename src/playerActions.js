module.exports = {

    isValidFecthAction(action) {
        switch (action) {
            case 'PlayerBuildings':
                return true;
            case 'PlayerArmies':
                return true;
            default:
                return false;
        }
    },

    isValidPostAction(endPoint) {
        switch (endPoint) {
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

}
