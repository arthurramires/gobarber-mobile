import React from 'react';
import { render } from 'react-native-testing-library';
import SignIn from '../../pages/SignIn';

jest.mock('@react-navigation/native', () => {
    return {
        useNavigation: jest.fn(),
    };
});

describe('Signin Page', () => {
    it('Should contains email/password', () => {
        const { getByPlaceholder } = render(<SignIn />);

        expect(getByPlaceholder('E-mail')).toBeTruthy();
        expect(getByPlaceholder('Senha')).toBeTruthy();
    });
});
