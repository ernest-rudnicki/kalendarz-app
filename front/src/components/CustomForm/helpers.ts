import { ResponseError } from '@generics/generics';
import { getEntries } from '@utils/general';

export function parseErrorResponse(errorResponse: ResponseError, VALIDATION_ERROR_MESSAGES: {[key: string]: string}):
Array<{name: string, errors: string[]}> {
    const entries = getEntries(errorResponse);
    const errors: Array<{name: string, errors: string[]}> = [];

    entries.forEach((el) => {
        if (el[1] && !Array.isArray(el[1])) {
            errors.push({ name: el[0], errors: [VALIDATION_ERROR_MESSAGES[el[1].type]] });
        }
    });

    return errors;
}
