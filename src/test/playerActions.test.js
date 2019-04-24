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
    expect(player.length).not.toBe(0);
}, 10000);
