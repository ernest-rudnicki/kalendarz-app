import React, { useCallback, useEffect, useState } from 'react';
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
import { debounceTime, mainWidthBreakpoint } from '@constants/constants';
import { debounce } from '@utils/general';

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
    const dispatch = useDispatch();

    const changeVisibilityOnStart = useCallback(() => {
        if (window.innerWidth <= mainWidthBreakpoint) {
            setSidebarVisible(false);
            return;
        }
        setSidebarVisible(true);
    }, []);

    const changeVisibility = useCallback(debounce(() => {
        if (window.innerWidth <= mainWidthBreakpoint) {
            return;
        }
        setSidebarVisible(true);
    }, debounceTime), []);

    useEffect(() => {
        changeVisibilityOnStart();
        dispatch(authenticate());

        window.addEventListener('resize', changeVisibility);
        return () => {
            window.removeEventListener('resize', changeVisibility);
        };
    }, []);

    return (
        <div className="app">
            <Sidebar
                visible={sidebarVisible}
                top={<Navigation />}
                bottom={<ReservationSearch />}
                headerText={<AppHeader />}
            />
            <div className="app-content">
                <main>
                    <div className="app-content-user-space">
                        <UserSpace />
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
