import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import CustomEmpty from './CustomEmpty';

describe('Custom Empty Component', () => {
    it('matches the snapshot', () => {
        const tree = renderer
            .create(
                <CustomEmpty description="Test" />
            )
            .toJSON();
        
        expect(tree).toMatchSnapshot();
    });

    it('renders text', () => {
        const text = 'Test'
        const screen = render(
            <CustomEmpty description={text} />

        );
        expect(screen.getByText(text)).toBeTruthy();
    });
});
