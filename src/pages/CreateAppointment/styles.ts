import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { Provider } from './index';

interface ProviderContainerProps {
    selected: boolean;
}

interface ProviderNameProps {
    selected: boolean;
}

interface HourProps {
    available: boolean;
    selected: boolean;
}

interface HourTextProps {
    selected: boolean;
}

export const Container = styled.View`
    flex: 1;
`;

export const Header = styled.View`
    padding: 24px;
    background: #28262e;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
    color: #f4ede8;
    font-size: 20px;
    font-family: 'RobotoSlab-Medium';
    margin-left: 16px;
`;

export const UserAvatar = styled.Image`
    width: 56px;
    height: 56px;
    border-radius: 28px;
    margin-left: auto;
`;

export const Content = styled.ScrollView``;

export const ProvidersListContainer = styled.View`
    height: 112px;
`;

export const ProvidersList = styled(FlatList as new () => FlatList<Provider>)`
    padding: 32px 24px;
`;

export const ProviderContainer = styled.TouchableOpacity<
    ProviderContainerProps
>`
    background: ${props => (props.selected ? '#FF9000' : '#3b3e47')};
    padding: 8px 12px;
    align-items: center;
    margin-right: 16px;
    border-radius: 10px;
    flex-direction: row;
`;

export const ProviderAvatar = styled.Image`
    width: 32px;
    height: 32px;
    border-radius: 16px;
`;

export const ProviderName = styled.Text<ProviderNameProps>`
    color: ${props => (props.selected ? '#232129' : '#f4ede8')};
    font-size: 16px;
    font-family: 'RobotoSlab-Medium';
    margin-left: 8px;
`;

export const Calendar = styled.View``;

export const Title = styled.Text`
    font-family: 'RobotoSlab-Medium';
    color: #f4ede8;
    margin: 0 24px 24px;
    font-size: 24px;
`;

export const OpenButton = styled.TouchableOpacity`
    height: 46px;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    margin: 0 24px;
    background: #ff9000;
`;

export const OpenButtonText = styled.Text`
    font-family: 'RobotoSlab-Medium';
    color: #232129;
    font-size: 16px;
`;

export const Schedule = styled.View`
    padding: 24px 0 16px;
`;

export const Section = styled.View`
    margin-bottom: 24px;
`;

export const SectionTitle = styled.Text`
    font-family: 'RobotoSlab-Regular';
    color: #999591;
    font-size: 18px;
    margin: 0 24px 12px;
`;

export const SectionContent = styled.ScrollView.attrs({
    contentContainerStyle: { paddingHorizontal: 24 },
    horizontal: true,
    showsHorizontalScrollIndicator: false,
})``;

export const Hour = styled.TouchableOpacity<HourProps>`
    padding: 12px;
    background: ${props => (props.selected ? '#FF9000' : '#3e3b47')};
    border-radius: 10px;
    margin-right: 8px;

    opacity: ${props => (props.available ? 1 : 0.3)};
`;

export const HourText = styled.Text<HourTextProps>`
    font-family: 'RobotoSlab-Regular';
    color: ${props => (props.selected ? '#3e3b47' : '#f4ede8')};
    font-size: 16px;
`;

export const CreateAppointmentButton = styled.TouchableOpacity`
    height: 50px;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    margin: 0 24px 24px;
    background: #ff9000;
`;

export const CreateAppointmentButtonText = styled.Text`
    font-family: 'RobotoSlab-Medium';
    color: #232129;
    font-size: 18px;
`;
