import axios from '@axios/axios';
import { ErrorType, PaginatedResults } from '@generics/generics';
import { AxiosError, AxiosResponse } from 'axios';

export interface AxiosErrorRequiredResponse<T = any, D = any> extends AxiosError<T, D> {
    response: AxiosResponse<T, D>;
}

export function isAxiosError<ErrorData>(err: AxiosError<ErrorData> | Error | unknown): err is AxiosError<ErrorData> {
    return !!(err as AxiosError).response;
}

export function isRequestErrorType(err: AxiosError<any> | Error | unknown): err is AxiosErrorRequiredResponse<ErrorType> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return !!(err as AxiosError).response?.data?.type;
}

export function isPaginatedResults<T>(results: PaginatedResults<T> | unknown): results is PaginatedResults<T> {
    return (results as PaginatedResults<T>).count !== undefined;
}

export function getList<R, T>(url: string, page?: number | null, filters?: T | null): Promise<AxiosResponse<R, any>> {
    let link = `${url}${page ? `?page=${page}` : ''}`;

    if (filters) {
        const entries = Object.entries(filters);
        let isFirstParam = true;

        entries.forEach(([key, value]) => {
            if (!entries[0][1]) {
                return;
            }

            if (!page && isFirstParam) {
                link = `${link}?${entries[0][0]}=${entries[0][1]}`;
                isFirstParam = false;

                return;
            }

            link = `${link}&${key}=${value}`;
        });
    }
    return axios.get(link);
}
