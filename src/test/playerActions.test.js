import playerActions from '../playerActions';
import { init } from '../server';

it('Fetching Base Buildings', async () => {
    const server = await init();
    const builginsBasesCollection = await playerActions.getBaseBuildings({});
    expect(builginsBasesCollection.length).not.toBe(0);
}, 10000);
