import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/Auth';
import {
    Container,
    Header,
    HeaderTitle,
    UserName,
    ProfileButton,
    UserAvatar,
    ProvidersList,
    ProviderContainer,
    ProviderAvatar,
    ProviderInfo,
    ProviderMeta,
    ProviderMetaText,
    ProviderName,
    ProvidersListTitle,
} from './styles';
import api from '../../services/api';

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

const Dashboard: React.FC = () => {
    const { signOut, user } = useAuth();
    const { navigate } = useNavigation();
    const [providers, setProviders] = useState<Provider[]>([]);

    const navigateToProfile = useCallback(() => {
        navigate('Profile');
    }, [navigate]);

    const navigateToAppointment = useCallback(
        (providerId: string) => {
            navigate('CreateAppointment', { providerId });
        },
        [navigate],
    );

    useEffect(() => {
        api.get('providers').then(response => {
            setProviders(response.data);
        });
    }, []);

    return (
        <Container>
            <Header>
                <HeaderTitle>
                    Bem vindo, {'\n'}
                    <UserName>{user.name}</UserName>
                </HeaderTitle>

                <ProfileButton onPress={navigateToProfile}>
                    <UserAvatar source={{ uri: user.avatar_url }} />
                </ProfileButton>
            </Header>

            <ProvidersList
                data={providers}
                keyExtractor={provider => provider.id}
                ListHeaderComponent={
                    <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
                }
                renderItem={({ item: provider }) => (
                    <ProviderContainer
                        onPress={() => navigateToAppointment(provider.id)}
                    >
                        <ProviderAvatar source={{ uri: provider.avatar_url }} />

                        <ProviderInfo>
                            <ProviderName>{provider.name}</ProviderName>

                            <ProviderMeta>
                                <Icon
                                    name="calendar"
                                    size={14}
                                    color="#FF9000"
                                />
                                <ProviderMetaText>
                                    Segunda à sexta
                                </ProviderMetaText>
                                <Icon name="clock" size={14} color="#FF9000" />
                                <ProviderMetaText>8h às 18h</ProviderMetaText>
                            </ProviderMeta>
                        </ProviderInfo>
                    </ProviderContainer>
                )}
            ></ProvidersList>
        </Container>
    );
};

export default Dashboard;
