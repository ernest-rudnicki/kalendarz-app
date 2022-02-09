import React, {
    useCallback, useContext, useEffect, useState,
} from 'react';
import { authenticate } from '@store/user/asyncActions';
import Navigation from '@components/Navigation/Navigation';
import ReservationSearch from '@components/ReservationSearch/ReservationSearch';
import Sidebar from '@components/Sidebar/Sidebar';
import UserSpace from '@components/UserSpace/UserSpace';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Home from '@pages/Home/Home';
import RoomTypes from '@pages/AdminZone/RoomTypes/RoomTypes';
import Rooms from '@pages/AdminZone/Rooms/Rooms';
import { MenuOutlined } from '@ant-design/icons';
import CustomButton from '@components/CustomButton/CustomButton';
import { ResizeListenerContext } from '@contexts/ResizeListenerContext/ResizeListenerContext';

import 'styles/global.less';
import 'styles/overrides.less';
import 'styles/animations.less';
import './App.less';

const AppHeader = () => (
    <span className="header-text">
        Kalendarz
        <sup>App</sup>
    </span>
);

const App: React.FC = () => {
    const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
    const bpContext = useContext(ResizeListenerContext);
    const dispatch = useDispatch();

    const onSidebarClose = useCallback(() => {
        setSidebarVisible(false);
    }, []);

    const changeVisibility = useCallback(() => {
        setSidebarVisible(!sidebarVisible);
    }, [sidebarVisible]);

    useEffect(() => {
        dispatch(authenticate());
    }, []);

    useEffect(() => {
        setSidebarVisible(!!bpContext?.between);
    }, [bpContext?.between]);

    return (
        <div className="app">
            <Sidebar
                trapActive={!bpContext?.between}
                visible={sidebarVisible}
                onClose={onSidebarClose}
                top={<Navigation />}
                bottom={<ReservationSearch />}
                headerText={<AppHeader />}
            />
            <div className="app-content">
                <main>
                    <div className="app-content-bar">
                        <UserSpace />
                        <CustomButton variant="icon" aria-label="otwórz nawigacje" className="app-content-bar-hamburger" onClick={changeVisibility}>
                            <MenuOutlined />
                        </CustomButton>
                    </div>
                    <div className="app-content-routes">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="admin-zone">
                                <Route path="room-types" element={<RoomTypes />} />
                                <Route path="rooms" element={<Rooms />} />
                            </Route>
                            <Route path="user-zone" element={<div>user zone</div>} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
