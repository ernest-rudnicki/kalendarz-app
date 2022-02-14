import TransparentButton from '@components/TransparentButton/TransparentButton';
import React, {
    useCallback, useEffect, useState,
} from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { isDefined, isNumber } from '@utils/general';

import './Switcher.less';

export interface SwitcherOption<T> {
  label: string;
  value: T;
}
export interface SwitcherProps<T> {
  options: SwitcherOption<T>[];
  selected?: number | null;
  onChange?: (value: T | null, exceeds?: IndexExceed) => void;
}

export enum IndexExceed {
    NONE,
    LEFT,
    RIGHT,
}

const Switcher = <T, >(props: SwitcherProps<T>): React.ReactElement => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const { selected, options, onChange } = props;
    const selectedItem = selected || selectedIndex;

    useEffect(() => {
        if (options.length === 0) {
            return;
        }
        setSelectedIndex(0);
    }, []);

    const onIndexChange = useCallback((index: number, exceeds?: IndexExceed): void => {
        if (onChange) {
            onChange(options[index] ? options[index].value : null, exceeds);
        }
    }, [onChange]);

    const onLeftButtonClick = useCallback(() => {
        if (!isNumber(selectedItem)) {
            return;
        }

        const newIndex = selectedItem - 1;

        if (newIndex < 0) {
            onIndexChange(newIndex, IndexExceed.LEFT);
            return;
        }

        onIndexChange(newIndex);

        if (isDefined(selected)) {
            return;
        }

        setSelectedIndex(newIndex);
    }, [selectedIndex, selected, onIndexChange]);

    const onRightButtonClick = useCallback(() => {
        if (!isNumber(selectedItem)) {
            return;
        }

        const newIndex = selectedItem + 1;

        if (newIndex > options.length - 1) {
            onIndexChange(newIndex, IndexExceed.RIGHT);
            return;
        }

        onIndexChange(newIndex);

        if (isDefined(selected)) {
            return;
        }

        setSelectedIndex(newIndex);
    }, [selectedIndex, selected, onIndexChange]);

    return (
        <div className="switcher">
            <TransparentButton onClick={onLeftButtonClick} className="switcher-btn switcher-btn-left">
                <LeftOutlined />
            </TransparentButton>
            <span className="switcher-selected">
                {selectedItem !== null ? options[selectedItem].label : ''}
            </span>
            <TransparentButton onClick={onRightButtonClick} className="switcher-btn switcher-btn-right">
                <RightOutlined />
            </TransparentButton>
        </div>
    );
};

export default Switcher;
