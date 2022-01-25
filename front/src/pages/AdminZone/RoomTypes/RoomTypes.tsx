import EditingPanel from '@components/EditingPanel/EditingPanel';
import { FormEditMode } from '@components/TwoModesForm/TwoModesForm';
import { RootState } from '@store/index';
import { createRoomType, getRoomTypes } from '@store/room-types/asyncActions';
import { RoomTypeCreateErrorResponse } from '@store/room-types/types';
import { getRequiredRule } from '@utils/form';
import { parseDate } from '@utils/general';
import { Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { AxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './RoomTypes.less';

export interface RoomTypeFormValues {
    name: string;
    color: string;
}

// TODO Calculate text color based on room type background color
const RoomTypes: React.FC = () => {
    const [form] = useForm<RoomTypeFormValues>();
    const [errorResponse, setErrorResponse] = useState<null | RoomTypeCreateErrorResponse>(null);
    const roomTypes = useSelector((state: RootState) => state.roomTypes);
    const { data, isLoading } = roomTypes;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getRoomTypes());
    }, []);

    const onFormSubmit = useCallback((values: RoomTypeFormValues, mode: FormEditMode) => {
        const requestOptions = {
            requestPayload: values,
            onSuccess: () => {
                dispatch(getRoomTypes());
            },
            onError: (errorData: AxiosError<RoomTypeCreateErrorResponse, any>) => {
                if (!errorData.response) {
                    return;
                }
                setErrorResponse(errorData.response.data);
            },
        };

        if (mode === FormEditMode.Create) {
            dispatch(createRoomType(requestOptions));
        }
    }, []);

    return (
        <div className="room-types">
            <EditingPanel
                className="room-types-content"
                listWithSearchProps={{
                    title: 'Typy pokojów',
                    searchLabel: 'Wyszukaj typ pokoju',
                    placeholder: 'Nazwa typu',
                    dataSource: data,
                    onDelete: () => console.log('delete'),
                    renderContent: (item) => (
                        <div className="room-types-content-item">
                            <div>{item.name}</div>
                            <div className="room-types-content-item-date">
                                {parseDate(item.created)}
                            </div>
                            <div className="room-types-content-item-color" style={{ backgroundColor: item.color }}>
                                {item.color}
                            </div>
                        </div>
                    ),
                }}
                twoModesFormProps={{
                    onFormSubmit,
                    errorResponse,
                    isLoading,
                    formProps: { form },
                    primaryBtnText: 'Stwórz nowy typ pokoju',
                }}
                formItems={(
                    <>
                        <Form.Item label="Podaj nazwę typu" name="name" rules={[getRequiredRule()]}>
                            <Input placeholder="Nazwa typu" />
                        </Form.Item>
                        <Form.Item label="Podaj kolor" name="color" rules={[getRequiredRule()]}>
                            <Input placeholder="Kolor" />
                        </Form.Item>
                    </>
                )}
            />
        </div>
    );
};

export default RoomTypes;
