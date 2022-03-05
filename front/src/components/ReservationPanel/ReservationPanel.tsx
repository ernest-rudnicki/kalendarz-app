import HugeDivider from '@components/HugeDivider/HugeDivider';
import { DAY_NAMES_FULL, TIME_BLOCK_MINUTES, WORKING_HOURS } from '@constants/constants';
import { Id } from '@generics/generics';
import { Room } from '@store/rooms/types';
import { joinClassNames, parseDateToDay } from '@utils/general';
import { Dayjs } from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import SwitcherLayout from '@components/Switcher/SwitcherLayout/SwitcherLayout';
import { ReservationHashMap, ReservationWithParsedDate } from '@store/reservations/types';
import { cloneDeep } from 'lodash';
import ReservationBlockChunk from './ReservationBlockChunk/ReservationBlockChunk';

import './ReservationPanel.less';
import { getDayReservationRanges } from './helpers';

export interface ReservationInterval {
    start: string;
    end: string;
    room: Id;
}
export interface ReservationPanelProps {
    day: Dayjs;
    className?: string;
    timeBlockContainerClassname?: string;
    rooms: Room[];
    reservations: ReservationHashMap;
    onReserve?: (intervals: ReservationInterval[]) => void;
    onLeftSwitcherClick?: () => void;
    onRightSwitcherClick?: () => void;
}
export interface BlocksHashMap {
    [key: string]: TimeInterval;
}
export interface TimeInterval {
    start?: Dayjs;
    end?: Dayjs;
    startLimit: Dayjs;
    endLimit: Dayjs;
}

export interface ReservationsPerRoom {
    [key: string]: ReservationRange[];
}

export interface ReservationRange {
    reservation?: ReservationWithParsedDate,
    start: Dayjs,
    end: Dayjs
}

const ReservationPanel: React.FC<ReservationPanelProps> = (props) => {
    const {
        day, className, timeBlockContainerClassname, rooms, reservations, onReserve, onLeftSwitcherClick, onRightSwitcherClick,
    } = props;
    const [reservationsPerRoom, setReservationsPerRoom] = useState<ReservationsPerRoom>({});
    const [selectedBlocks, setSelectedBlocks] = useState<BlocksHashMap>({});
    const [hoveredBlocks, setHoveredBlocks] = useState<BlocksHashMap>({});

    const prepareData = useCallback((room: Room): ReservationRange[] | null => {
        const roomReservation = reservations[room.id];
        const ranges: ReservationRange[] = [];
        const dayRange = getDayReservationRanges(day, WORKING_HOURS);
        let { startToday } = dayRange;
        const { endToday } = dayRange;

        if (!roomReservation) {
            return null;
        }

        roomReservation.forEach((el) => {
            if (el.start.isSame(startToday)) {
                ranges.push({ reservation: el, start: el.start, end: el.end });
                startToday = el.end.clone().add(TIME_BLOCK_MINUTES, 'minutes');
                return;
            }
            const diff = el.start.diff(startToday, 'minutes');

            ranges.push({
                start: startToday,
                end: startToday.minute(diff - TIME_BLOCK_MINUTES),
            });

            ranges.push({
                reservation: el,
                start: el.start,
                end: el.end,
            });
            startToday = el.end.clone().add(TIME_BLOCK_MINUTES, 'minutes');
        });

        ranges.push({
            start: startToday,
            end: endToday,
        });

        return ranges;
    }, [reservations]);

    useEffect(() => {
        const newReservationsPerRoom: ReservationsPerRoom = {};
        rooms.forEach((el) => {
            const ranges = prepareData(el);
            if (!ranges) {
                return;
            }
            newReservationsPerRoom[el.id] = ranges;
        });
        setReservationsPerRoom(newReservationsPerRoom);
    }, [rooms, reservations]);

    const onSelectBlock = useCallback((startLimit: Dayjs, endLimit: Dayjs, selected: Dayjs, room: Room) => {
        const copy = cloneDeep(selectedBlocks);
        const selectedBlock = copy[room.id];

        if (selectedBlock?.startLimit.isAfter(selected) || selectedBlock?.endLimit.isBefore(selected)) {
            return;
        }

        if (!selectedBlock) {
            copy[room.id] = {
                start: selected,
                startLimit,
                endLimit,
            };
        }

        if (selectedBlock) {
            if (selectedBlock.start?.isAfter(selected)) {
                copy[room.id].end = copy[room.id].start;
                copy[room.id].start = selected;
            } else if (selectedBlock.start?.isSame(selected)) {
                delete copy[room.id];
            } else {
                copy[room.id].end = selected;
            }
        }

        setSelectedBlocks(copy);
    }, [selectedBlocks]);

    const onHoverBlock = useCallback((startLimit: Dayjs, endLimit: Dayjs, hovered: Dayjs, room: Room) => {
        const copy = cloneDeep(hoveredBlocks);
        const hoveredBlock = copy[room.id];
        if (hoveredBlock?.startLimit.isAfter(hovered) || hoveredBlock?.endLimit.isBefore(hovered)) {
            return;
        }

        copy[room.id] = {
            end: hovered,
            startLimit,
            endLimit,
        };

        setHoveredBlocks(copy);
    }, [hoveredBlocks]);

    const onMouseLeave = useCallback((room: Room) => {
        const copy = cloneDeep(hoveredBlocks);
        if (copy[room.id]) {
            delete copy[room.id];
        }

        setHoveredBlocks(copy);
    }, [hoveredBlocks]);

    const createChunk = (endIndex: number, start: Dayjs, room: Room) => {
        const reservation = selectedBlocks[room.id];
        const hovered = hoveredBlocks[room.id];
        return (
            <ReservationBlockChunk
                key={start.format('HH:mm')}
                startSelected={reservation?.start}
                endSelected={reservation?.end}
                hoveredEnd={hovered?.end}
                onClick={(startLimit, endLimit, selected) => onSelectBlock(startLimit, endLimit, selected, room)}
                onMouseEnter={(startLimit, endLimit, selected) => onHoverBlock(startLimit, endLimit, selected, room)}
                onMouseLeave={() => onMouseLeave(room)}
                blocks={endIndex}
                start={start}
            />
        );
    };

    const renderBlocks = useCallback((room: Room) => {
        const dayRange = getDayReservationRanges(day, WORKING_HOURS);
        const { startToday } = dayRange;
        const { endToday } = dayRange;

        const blocks = endToday.diff(startToday, 'minutes') / TIME_BLOCK_MINUTES;
        return createChunk(blocks, startToday, room);
    }, [day, createChunk]);

    const renderBlocksWithReservation = useCallback((room: Room) => {
        let elements: React.ReactElement[] = [];
        reservationsPerRoom[room.id].forEach((el) => {
            const diff = el.end.diff(el.start, 'minutes');
            const blocks = (diff / TIME_BLOCK_MINUTES);
            const cols = (blocks * 2) + 2;

            if (el.reservation) {
                elements.push(
                    <td
                        key={el.reservation.id}
                        colSpan={cols}
                        style={{ backgroundColor: el.reservation.color }}
                        className="block-table-row-reserved"
                    >
                        {`${el.reservation.user.firstName} ${el.reservation.user.lastName}`}
                    </td>,
                );
                return;
            }
            elements = [...elements, createChunk(blocks, el.start, room)];
        });

        return elements;
    }, [reservationsPerRoom, createChunk]);

    return (
        <div className={joinClassNames(['reservation-panel', className])}>
            <HugeDivider className="reservation-panel-divider" text={DAY_NAMES_FULL[day.day()]} />
            <div className="reservation-panel-switcher">
                <SwitcherLayout onLeftClick={onLeftSwitcherClick} onRightClick={onRightSwitcherClick}>
                    {parseDateToDay(day)}
                </SwitcherLayout>
            </div>
            <div className={joinClassNames(['reservation-panel-container', timeBlockContainerClassname])}>
                <div className="reservation-panel-container-table">
                    <table className="block-table">
                        <colgroup>
                            <col span={8} width={150} />
                            <col span={8} width={150} />
                            <col span={8} width={150} />
                            <col span={8} width={150} />
                            <col span={8} width={150} />
                            <col span={8} width={150} />
                            <col span={8} width={150} />
                            <col span={8} width={150} />
                            <col span={8} width={150} />
                            <col span={8} width={150} />
                            <col span={8} width={150} />
                            <col span={8} width={150} />
                            <col span={8} width={150} />
                            <col span={8} width={150} />
                        </colgroup>
                        <thead>
                            <tr className="block-table-row">
                                <th colSpan={8} className="block-table-row-col block-table-row-header">Nazwa sali</th>
                                <th colSpan={8} className="block-table-row-col block-table-row-header block-table-row-left">Liczba miejsc</th>
                                {WORKING_HOURS.map((el) => (
                                    <th colSpan={8} key={el} className="block-table-row-col block-table-row-header">
                                        {el}
                                        :00
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room.id} className="block-table-row block-table-row-room">
                                    <th colSpan={8} style={{ backgroundColor: room.type.color }} className="block-table-row-col block-table-row-header">{room.name}</th>
                                    <th
                                        colSpan={8}
                                        style={{ backgroundColor: room.type.color }}
                                        className="block-table-row-col block-table-row-header block-table-row-left"
                                    >
                                        {room.capacity}

                                    </th>
                                    {reservationsPerRoom[room.id] ? renderBlocksWithReservation(room) : renderBlocks(room)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReservationPanel;
