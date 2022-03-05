import { Dayjs } from 'dayjs';
import { TimeInterval } from '../ReservationPanel';

export function isBlockSelected(current: Dayjs, selectedInterval?: TimeInterval, hovered?: Dayjs): boolean {
    if (selectedInterval?.start?.isBefore(current) && selectedInterval?.end?.isAfter(current)) {
        return true;
    }

    if (selectedInterval?.start?.isSame(current) || selectedInterval?.end?.isSame(current)) {
        return true;
    }

    if (!selectedInterval?.start || !hovered) {
        return false;
    }

    if (selectedInterval.startLimit.isAfter(hovered) || selectedInterval.endLimit.isBefore(hovered)) {
        return false;
    }

    if (current.isSameOrAfter(hovered) && current.isBefore(selectedInterval.start)) {
        return true;
    }

    if (!selectedInterval.end) {
        if (current.isSameOrBefore(hovered) && current.isAfter(selectedInterval.start)) {
            return true;
        }
    } else if (current.isSameOrBefore(hovered) && current.isAfter(selectedInterval.end)) {
        return true;
    }

    return false;
}
