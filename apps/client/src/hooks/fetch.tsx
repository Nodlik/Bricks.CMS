import * as API from '../utils/API';

import useAJAX, { RequestStatus } from './ajax';
import { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';

export function useFetchRequest<T>(path: string): T | undefined {
    const [result, setResult] = useState<T>();

    const request = useAJAX<T>();
    const history = useHistory();

    const send = request.send;
    useEffect(() => {
        send(API.GET(path));
    }, [path, send]);

    useEffect(() => {
        if (request.result.status === RequestStatus.SUCCESS) {
            setResult(request.result.response);
        } else if (request.result.error?.statusCode === 404) {
            history.push('/404');
        }
        // else {

        // }
    }, [request.result, history]);

    return result;
}
