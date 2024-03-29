import { ConfigProvider } from 'antd';
import React from 'react';
import { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/es/date-picker/generatePicker';
import locale from 'antd/es/locale/pl_PL';

import './CustomDatePicker.less';

const GeneratedDatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

const CustomDatePicker: React.FC<typeof GeneratedDatePicker.defaultProps> = (props) => {
    const {
        dropdownClassName, className, children, ...rest
    } = props;
    const customClassName = className ? `${className} custom-date-picker` : 'custom-date-picker';
    const customDropdownClassName = dropdownClassName ? `${dropdownClassName} custom-date-picker-dropdown` : 'custom-date-picker-dropdown';

    return (
        <ConfigProvider locale={locale}>
            <GeneratedDatePicker {...rest} className={customClassName} dropdownClassName={customDropdownClassName}>{children}</GeneratedDatePicker>
        </ConfigProvider>
    );
};

export default CustomDatePicker;
