import { RootState } from '@store/index';
import { Group } from '@store/user/types';
import { useSelector } from 'react-redux';

const useAdmin = (): boolean => {
    const user = useSelector((state: RootState) => state.user.data);

    return user?.groups === Group.ADMIN;
};

export default useAdmin;
