export const FORM_LAYOUT = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

export const VALIDATION_ERROR_MESSAGES: {[key: string]: string} = {
    USERNAME_TAKEN: 'Użytkownik o podanej nazwie już istnieje',
    EMAIL_TAKEN: 'Użytkownik o podanym emailu już istnieje',
    PASSWORD_TOO_SIMPLE: 'Hasło jest zbyt proste',
    INVALID_CREDENTIALS: 'Błędne hasło lub nazwa użytkownika',
    NOT_UNIQUE_NAME: 'Nazwa już została zajęta',
};

export const DAY_NAMES = ['Nd', 'Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb'];
export const DAY_NAMES_FULL = ['Niedziela', 'Poniedzialek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
export const MONTH_NAMES = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
export const WORKING_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
export const TIME_BLOCK_MINUTES = 15;

export enum Month {
    JANUARY,
    FEBRUARY,
    MARCH,
    APRIL,
    MAY,
    JUNE,
    JULY,
    AUGUST,
    SEPTEMBER,
    OCTOBER,
    NOVEMBER,
    DECEMBER,
}

export const PAGE_SIZE = 10;

export const DEBOUNCE_TIME = 350; // miliseconds

export enum RequestErrorType {
    RELATED_OBJECT = 'RELATED_OBJECT'
}

export const NUMBER_DECLINATION_MAP = {
    place: {
        one: 'miejsce',
        twoToFour: 'miejsca',
        rest: 'miejsc',
    },
};

export const BLOCK_COLORS = ['#019267', '#FFD365', '#5463FF', '#533E85', '#AD8B73', '#FFB72B', '#085E7D', '#BB6464', '#9C51E0'];

export const ROLE_NAMES = ['Brak', 'Administrator', 'Zwykły użytkownik'];
