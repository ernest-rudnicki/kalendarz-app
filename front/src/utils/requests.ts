import axios from '@axios/axios';
import { AxiosError, AxiosResponse } from 'axios';

export function isAxiosError<ErrorData>(err: AxiosError<ErrorData> | Error | unknown): err is AxiosError<ErrorData> {
    return !!(err as AxiosError).response;
}

export function getList<R, T>(url: string, page?: number | null, filters?: T | null): Promise<AxiosResponse<R, any>> {
    let link = `${url}${page ? `?page=${page}` : ''}`;

    if (filters) {
        const entries = Object.entries(filters);
        if (!page && entries.length !== 0) {
            link = `${link}?${entries[0][0]}=${entries[0][1]}`;
            entries.shift();
        }
        entries.forEach(([key, value]) => {
            link = `${link}&${key}=${value}`;
        });
    }

    return axios.get(link);
}
