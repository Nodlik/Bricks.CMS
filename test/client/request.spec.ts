import * as API from '../../apps/client/src/utils/API';

describe('Client fetch request', () => {
    test('check url encoding', async () => {
        const res = await API.Request(
            '/folders',
            { limit: 10, offset: 5, title: 'ståle' },
            API.REQUEST_METHOD.GET
        );

        expect(res.paramsString).toBe('?limit=10&offset=5&title=st%C3%A5le');
    });
});
