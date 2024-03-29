import React from 'react';
import MockDate from 'mockdate';
import renderer from 'react-test-renderer';
import Calendar from './Calendar';
import { createDayList, createLastDaysFromMonday, evaluateCurrentMonthDayType, getMonthsOptions } from './helpers';
import dayjs from 'dayjs';
import { CalendarItemType } from './CalendarItem/CalendarItem';
import { Month, MONTH_NAMES } from '@constants/constants';
import { fireEvent, render } from '@testing-library/react';


const date = '2022-02-20';
describe('Calendar Component', () => {
    
    beforeEach(() => {
        MockDate.set(date);
    });

    afterEach(() => {
        MockDate.reset();
    })
    
    it('matches the snapshot', () => {
        const tree = renderer
            .create(
                <Calendar />
            )
            .toJSON();
        
        expect(tree).toMatchSnapshot();
    });

    it('triggers click', () => {
        const onDayClick = jest.fn();

        const element = render(
            <Calendar onDayClick={onDayClick} />
        );
        fireEvent.click(element.getByText(/01/i));
        expect(onDayClick).toBeCalledTimes(1);
    });

    it('changes to the year before', async () => {
        MockDate.set('2022-01-01')

        const element = render(
            <Calendar />
        );
        fireEvent.click(element.getByTestId('left-btn'));

        expect(await element.queryByText('2021')).not.toBeNull();
    });

    it('changes to the next year', async () => {
        MockDate.set('2022-12-31')

        const element = render(
            <Calendar />
        );
        fireEvent.click(element.getByTestId('right-btn'));

        expect(await element.queryByText('2023')).not.toBeNull();
    });

    it('changes to the next month', async () => {
        MockDate.set('2022-03-01')

        const element = render(
            <Calendar />
        );
        fireEvent.click(element.getByTestId('right-btn'));

        expect(await element.queryByText('Kwiecień')).not.toBeNull();
    });

    it('changes to the month before', async () => {
        MockDate.set('2022-03-01')

        const element = render(
            <Calendar />
        );
        fireEvent.click(element.getByTestId('left-btn'));

        expect(await element.queryByText('Luty')).not.toBeNull();
    });

    it('changes to the year before', async () => {
        MockDate.set('2022-01-01')

        const element = render(
            <Calendar />
        );
        fireEvent.click(element.getByTestId('left-btn'));

        expect(await element.queryByText('2021')).not.toBeNull();
    });
});

describe('Calendar Component helpers', () => {
    describe('createLastDaysFromMonday', () => {
        it('returns last days from monday of a month before ', () => {
            const january = createLastDaysFromMonday(2022, Month.JANUARY, () => CalendarItemType.ANOTHER_MONTH_DAY);
            expect(january.length).toBe(1);

            const february = createLastDaysFromMonday(2022, Month.FEBRUARY, () => CalendarItemType.ANOTHER_MONTH_DAY);
            expect(february.length).toBe(1);

            const march = createLastDaysFromMonday(2022, Month.MARCH, () => CalendarItemType.ANOTHER_MONTH_DAY);
            expect(march.length).toBe(4);

            const april = createLastDaysFromMonday(2022, Month.APRIL, () => CalendarItemType.ANOTHER_MONTH_DAY);
            expect(april.length).toBe(6);

            const may  = createLastDaysFromMonday(2022, Month.MAY, () => CalendarItemType.ANOTHER_MONTH_DAY);
            expect(may.length).toBe(2);

            const june  = createLastDaysFromMonday(2022, Month.JUNE, () => CalendarItemType.ANOTHER_MONTH_DAY);
            expect(june.length).toBe(4);

            const july  = createLastDaysFromMonday(2022, Month.JULY, () => CalendarItemType.ANOTHER_MONTH_DAY);
            expect(july.length).toBe(0);

            const august  = createLastDaysFromMonday(2022, Month.AUGUST, () => CalendarItemType.ANOTHER_MONTH_DAY);
            expect(august.length).toBe(3);

            const september  = createLastDaysFromMonday(2022, Month.SEPTEMBER, () => CalendarItemType.ANOTHER_MONTH_DAY);
            expect(september.length).toBe(5);

            const october = createLastDaysFromMonday(2022, Month.OCTOBER, () => CalendarItemType.ANOTHER_MONTH_DAY);
            expect(october.length).toBe(1);

            const november = createLastDaysFromMonday(2022, Month.NOVEMBER, () => CalendarItemType.ANOTHER_MONTH_DAY);
            expect(november.length).toBe(3);

            const december = createLastDaysFromMonday(2022, Month.DECEMBER, () => CalendarItemType.ANOTHER_MONTH_DAY);
            expect(december.length).toBe(6);

        });
    });

    it('getMonthsOptions', () => {
        const options = getMonthsOptions(MONTH_NAMES);

        expect(options.length).toBe(12);
    });

    describe('evaluateCurrentMonthDayType', () => {
        beforeEach(() => {
            MockDate.set(date);
        });
    
        afterEach(() => {
            MockDate.reset();
        })

        it('returns normal day', () => {
            const type = evaluateCurrentMonthDayType(dayjs(date).add(1, 'day'));

            expect(type).toBe(CalendarItemType.NORMAL);
        });

        it('returns today', () => {
            const type = evaluateCurrentMonthDayType(dayjs(date));

            expect(type).toBe(CalendarItemType.TODAY);
        });

        it('returns another month day', () => {
            const type = evaluateCurrentMonthDayType(dayjs(date).add(-1, 'day'));

            expect(type).toBe(CalendarItemType.BEFORE_TODAY);
        });

        it('returns dayoff', () => {
            const type = evaluateCurrentMonthDayType(dayjs(date).day(7));

            expect(type).toBe(CalendarItemType.DAYOFF);
        });
    });

    describe('createDayList', () => {
        it('returns all days in month', () => {
            const january = createDayList(2022, Month.JANUARY, () => CalendarItemType.NORMAL);
            expect(january.length).toBe(31);

            const february = createDayList(2022, Month.FEBRUARY, () => CalendarItemType.NORMAL);
            expect(february.length).toBe(28);

            // leap year
            const leapFebruary = createDayList(2020, Month.FEBRUARY, () => CalendarItemType.NORMAL);
            expect(leapFebruary.length).toBe(29);

            const march = createDayList(2022, Month.MARCH, () => CalendarItemType.NORMAL);
            expect(march.length).toBe(31);

            const april = createDayList(2022, Month.APRIL, () => CalendarItemType.NORMAL);
            expect(april.length).toBe(30);

            const may  = createDayList(2022, Month.MAY, () => CalendarItemType.NORMAL);
            expect(may.length).toBe(31);

            const june  = createDayList(2022, Month.JUNE, () => CalendarItemType.NORMAL);
            expect(june.length).toBe(30);

            const july  = createDayList(2022, Month.JULY, () => CalendarItemType.NORMAL);
            expect(july.length).toBe(31);

            const august  = createDayList(2022, Month.AUGUST, () => CalendarItemType.NORMAL);
            expect(august.length).toBe(31);

            const september  = createDayList(2022, Month.SEPTEMBER, () => CalendarItemType.NORMAL);
            expect(september.length).toBe(30);

            const october = createDayList(2022, Month.OCTOBER, () => CalendarItemType.NORMAL);
            expect(october.length).toBe(31);

            const november = createDayList(2022, Month.NOVEMBER, () => CalendarItemType.NORMAL);
            expect(november.length).toBe(30);

            const december = createDayList(2022, Month.DECEMBER, () => CalendarItemType.NORMAL);
            expect(december.length).toBe(31);
        })
    })
});
