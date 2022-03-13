import CustomForm from '@components/CustomForm/CustomForm';
import SingleColumnLayout from '@components/SingleColumnLayout/SingleColumnLayout';
import { RootState } from '@store/index';
import { getUser, updateUser } from '@store/user/asyncActions';
import { UserErrorResponse } from '@store/user/types';
import {
    getEmailRule,
    getMaxCharRule, getMinCharRule, getNumericPasswordRule, getSpecialCharacterPasswordRule,
} from '@utils/form';
import { Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { AxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './MyAccount.less';

export interface UserFormValues {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}

const MyAccount: React.FC = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [errorResponse, setErrorResponse] = useState<null | UserErrorResponse>(null);
    const dispatch = useDispatch();
    const [form] = useForm<UserFormValues>();

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        dispatch(getUser({ requestPayload: currentUser.id }));
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            ...currentUser,
        });
    }, [currentUser]);

    const onFinish = useCallback((values: UserFormValues) => {
        if (!currentUser) {
            return;
        }

        dispatch(updateUser({
            requestPayload: { id: currentUser?.id, ...values },
            onError: (errorData: AxiosError<UserErrorResponse, any>) => {
                if (!errorData.response) {
                    return;
                }
                setErrorResponse(errorData.response.data);
            },
        }));
    }, [currentUser]);

    return (
        <div className="my-account">
            <SingleColumnLayout headerText="Moje konto" className="my-account-content">
                <CustomForm errorResponse={errorResponse} formProps={{ form, onFinish }} primaryBtnText="Zaktualizuj swoje konto">
                    <Form.Item
                        name="firstName"
                        label="Imię"
                        rules={[getMaxCharRule(24, 'Imię może mieć maksymalnie 24 znaki')]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label="Nazwisko"
                        rules={[getMaxCharRule(24, 'Nazwisko może mieć maksymalnie 24 znaki')]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="Nazwa użytkownika"
                        rules={[getMaxCharRule(24, 'Nazwa użytkownika może mieć maksymalnie 24 znaki')]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Adres email"
                        rules={[
                            getMaxCharRule(50, 'Adres email może mieć maksymalnie 50 znaków'),
                            getEmailRule(),
                        ]}
                    >
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            getMaxCharRule(24, 'Hasło może mieć maksymalnie 24 znaki'),
                            getMinCharRule(9, 'Hasło musi mieć conajmniej 9 znaków'),
                            getNumericPasswordRule(),
                            getSpecialCharacterPasswordRule(),
                        ]}
                        name="password"
                        label="Nowe hasło"
                    >
                        <Input type="password" />
                    </Form.Item>
                </CustomForm>
            </SingleColumnLayout>
        </div>
    );
};

export default MyAccount;
