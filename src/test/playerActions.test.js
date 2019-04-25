import playerActions from '../playerActions';
import { init } from '../server';

let server = {};

beforeAll(async () => {
    server = await init();
});

test('Fetching Base Buildings', async () => {
    const buildinsBasesCollection = await playerActions.getBaseBuildings({});
    expect(buildinsBasesCollection.length).not.toBe(0);
}, 10000);

test('Fetching First AI player', async () => {
    const player = await playerActions.getPlayer({ id: 1 });
    expect(player.name).toBe('Persian Empire');
}, 10000);

test('Test upgrade building', async () => {
    const player = (await playerActions.upgradeBuilding({ userId: 1, buildingId: 1 }));
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
    const result = (await playerActions.upgradeBuilding({ userId: 1, buildingId: 1 }));
    expect(result).toBe(false);
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
    const result = (await playerActions.upgradeBuilding({ userId: 1, buildingId: 1 }));
    expect(result).toBe(false);
}, 10000);

afterAll(async () => {
    await playerActions.waterline.models.resources.updateOne({ id: 1 })
        .set({
            gold: 10000,
        });
    await playerActions.waterline.models.city.updateOne({ id: 1 })
        .set({
            constructing: null,
            constructionTimeLeft: null,
        });
});
