import { SwitcherOption } from '@components/Switcher/Switcher';
import { dayNames, Month } from '@constants/constants';
import { isBeforeToday, isToday, isWeekend } from '@utils/general';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarItemType } from './CalendarItem/CalendarItem';

export interface CalendarDay {
    dayNumber: string;
    dayName: string;
    type: CalendarItemType;
}
export type EvaluateTypeHandler = (date: Dayjs) => CalendarItemType;
export function createDayList(year: number, month: Month, evaluateType: EvaluateTypeHandler): CalendarDay[] {
    const dayList: CalendarDay[] = [];
    const date = new Date(year, month, 1);
    const numberOfDays = dayjs(date).daysInMonth();

    for (let i = 0; i < numberOfDays; i++) {
        const dateTmp = dayjs(date).add(i, 'day');
        const dayNumber = dateTmp.day();
        dayList.push(
            {
                dayNumber: i < 9 ? `0${i + 1}` : `${i + 1}`,
                dayName: dayNames[dayNumber],
                type: evaluateType(dateTmp),
            },
        );
    }
    return dayList;
}

export function createLastWeekList(year: number, month: Month, evaluateType: EvaluateTypeHandler): CalendarDay[] {
    const dayList: CalendarDay[] = [];
    const date = new Date(year, month, 1);
    const lastDay = dayjs(date).endOf('month');
    const lastDayNumber = lastDay.day();

    for (let i = lastDayNumber - 1; i >= 0; i--) {
        const dateTmp = dayjs(lastDay).subtract(i, 'day');
        const dayNumber = dateTmp.day();
        dayList.push(
            {
                dayNumber: `${dateTmp.format('DD')}`,
                dayName: dayNames[dayNumber],
                type: evaluateType(dateTmp),
            },
        );
    }
    return dayList;
}

export function evaluateCurrentMonthDayType(current: Dayjs): CalendarItemType {
    if (isBeforeToday(current)) {
        return CalendarItemType.BEFORE_TODAY;
    }

    if (isToday(current)) {
        return CalendarItemType.TODAY;
    }

    if (isWeekend(current)) {
        return CalendarItemType.DAYOFF;
    }

    return CalendarItemType.NORMAL;
}

export function getMonthsOptions(months: string[]): SwitcherOption<Month>[] {
    return months.map((el, index) => ({ label: el, value: index }));
}