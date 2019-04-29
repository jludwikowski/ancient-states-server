import playerActions from '../doActions';
import getActions from '../getActions';
import { init } from '../server';

let server = {};

beforeAll(async () => {
    server = await init();
});

test('Test upgrade building', async () => {
    const player = (await playerActions.UpgradeBuilding({ userId: 1, buildingId: 1 }));
    expect(player.length).not.toBe(0);
    expect(player.city.constructing).toBe('barracks');
    expect(player.city.constructionTimeLeft).toBe(10379);
    expect(player.resources.gold).toBe(5951);
}, 10000);

test('Test upgrade building when already under construction', async () => {
    await playerActions.waterline.models.city.updateOne({ id: 1 })
        .set({
            constructing: 'forge',
            constructionTimeLeft: 100,
        });
    const result = (await playerActions.UpgradeBuilding({ userId: 1, buildingId: 1 }));
    expect(result.error).toBe('Cannot upgrade building barracks');
    await playerActions.waterline.models.city.updateOne({ id: 1 })
        .set({
            constructing: null,
            constructionTimeLeft: null,
        });
}, 10000);

test('Test upgrade building with no money', async () => {
    await playerActions.waterline.models.resources.updateOne({ id: 1 })
        .set({
            gold: 1000,
        });
    const result = (await playerActions.UpgradeBuilding({ userId: 1, buildingId: 1 }));
    expect(result.error).toBe('Cannot upgrade building barracks');
}, 10000);

test('Test create army with no enough men', async () => {
    const army = (await playerActions.CreateArmy({
        position: '0,0', owner: 1, name: 'Jest Test Army', units: [{ baseUnit: 1, number: 100000, level: 1 }],
    }));
    const garrison = await getActions.getArmy({ id: 1 });
    expect(army.error).toBe('Cannot create new army');
    expect(garrison.units[0].number).toBe(10000);
}, 10000);

test('Test create army with wrong level', async () => {
    const army = (await playerActions.CreateArmy({
        position: '0,0', owner: 1, name: 'Jest Test Army', units: [{ baseUnit: 1, number: 1000, level: 2 }],
    }));
    const garrison = await getActions.getArmy({ id: 1 });
    expect(army.error).toBe('Cannot create new army');
    expect(garrison.units[0].number).toBe(10000);
}, 10000);

test('Test create army', async () => {
    const army = (await playerActions.CreateArmy({
        position: '0,0', owner: 1, name: 'Jest Test Army', units: [{ baseUnit: 1, number: 100, level: 1 }],
    }));
    const garrison = await getActions.getArmy({ id: 1 });
    expect(army.length).not.toBe(0);
    expect(army.units.length).toBe(1);
    expect(army.units[0].baseUnit).toBe(1);
    expect(army.units[0].number).toBe(100);
    expect(garrison.units[0].number).toBe(9900);
}, 10000);

test('Test disband army when not in your city', async () => {
    const testArmiesCollection = await playerActions.waterline.models.army.find({ name: 'Jest Test Army' })
        .populate('units');
    const ourTestArmy = testArmiesCollection[0];
    const garrison = await getActions.getArmy({ id: 1 });
    ourTestArmy.position = '999,999'
    const result = await playerActions.DisbandArmy(ourTestArmy);
    expect(result.error).toBe('Cannot disband army away from capital');
    expect(garrison.units[0].number).toBe(9900);
}, 10000);

test('Test disband army when in your city', async () => {
    const testArmiesCollection = await playerActions.waterline.models.army.find({ name: 'Jest Test Army' })
        .populate('units');
    const ourTestArmy = testArmiesCollection[0];
    const result = await playerActions.DisbandArmy(ourTestArmy);
    const disbandedArmy = await playerActions.waterline.models.army.find({ id: ourTestArmy.id });
    expect(result.message).toBe('army 2 disbanded');
    expect(disbandedArmy.length).toBe(0);
    const resultgarrison = await getActions.getArmy({ id: 1 });
    expect(resultgarrison.units[0].number).toBe(10000);
}, 10000);

afterAll(async () => {
    const testArmiesCollection = await playerActions.waterline.models.army.find({ name: 'Jest Test Army' });
    const armyIdArray = [];
    testArmiesCollection.forEach(army => armyIdArray.push(army.id));
    await Promise.all([
        playerActions.waterline.models.resources.updateOne({ id: 1 })
            .set({
                gold: 10000,
            }),
        playerActions.waterline.models.city.updateOne({ id: 1 })
            .set({
                constructing: null,
                constructionTimeLeft: null,
            }),
        playerActions.waterline.models.army.destroy({ name: 'Jest Test Army' }),
        playerActions.waterline.models.unit.destroy({ army: { in: armyIdArray } }),
    ]);
});
