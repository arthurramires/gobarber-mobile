import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import {
    Container,
    Header,
    BackButton,
    HeaderTitle,
    UserAvatar,
    ProvidersListContainer,
    ProvidersList,
    ProviderContainer,
    ProviderAvatar,
    ProviderName,
    Calendar,
    Title,
    OpenButton,
    OpenButtonText,
    Schedule,
    Section,
    SectionTitle,
    SectionContent,
    Hour,
    HourText,
    Content,
    CreateAppointmentButton,
    CreateAppointmentButtonText,
} from './styles';
import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';

interface RouteParams {
    providerId: string;
}

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

interface ItemAvailability {
    hour: number;
    available: boolean;
}

const CreateAppointment: React.FC = () => {
    const route = useRoute();
    const [availability, setAvailability] = useState<ItemAvailability[]>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const routeParams = route.params as RouteParams;
    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState(0);
    const [selectedProvider, setSelectedProvider] = useState(
        routeParams.providerId,
    );
    const { user } = useAuth();
    const { goBack, navigate } = useNavigation();

    useEffect(() => {
        api.get('providers').then(response => {
            setProviders(response.data);
        });
    }, []);

    useEffect(() => {
        api.get(`providers/${selectedProvider}/day-availability`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            },
        }).then(response => {
            setAvailability(response.data);
        });
    }, [selectedDate, selectedProvider]);

    const handleSelectProvider = useCallback((providerId: string) => {
        setSelectedProvider(providerId);
    }, []);

    const handleToggleDatePicker = useCallback(() => {
        setShowDatePicker(state => !state);
    }, []);

    const handleDateChange = useCallback(
        (event: any, date: Date | undefined) => {
            if (Platform.OS === 'android') {
                setShowDatePicker(false);
            }

            if (date) {
                setSelectedDate(date);
            }
        },
        [],
    );

    const handleSelectHour = useCallback((hour: number) => {
        setSelectedHour(hour);
    }, []);

    const handleMorning = useMemo(() => {
        return availability
            .filter(({ hour }) => hour < 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                    available,
                };
            });
    }, [availability]);

    const handleAfternoon = useMemo(() => {
        return availability
            .filter(({ hour }) => hour > 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                    available,
                };
            });
    }, [availability]);

    const navigateBack = useCallback(() => {
        goBack();
    }, [goBack]);

    const handleCreateAppointment = useCallback(async () => {
        try {
            const date = new Date(selectedDate);

            date.setHours(selectedHour);
            date.setMinutes(0);

            await api.post('appointments', {
                provider_id: selectedProvider,
                date,
            });
            navigate('AppointmentCreated', { date: date.getTime() });
        } catch (err) {
            Alert.alert(
                'Erro ao criar agendamento',
                'Ocorreu um erro ao tentar criar um agendamento, tente novamente!',
            );
        }
    }, [navigate, selectedDate, selectedHour, selectedProvider]);

    return (
        <Container>
            <Header>
                <BackButton onPress={navigateBack}>
                    <Icon name="chevron-left" size={24} color="#999591" />
                </BackButton>

                <HeaderTitle>Cabeleireiros</HeaderTitle>

                <UserAvatar source={{ uri: user.avatar_url }} />
            </Header>

            <Content>
                <ProvidersListContainer>
                    <ProvidersList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={providers}
                        keyExtractor={provider => provider.id}
                        renderItem={({ item: provider }) => (
                            <ProviderContainer
                                onPress={() =>
                                    handleSelectProvider(provider.id)
                                }
                                selected={provider.id === selectedProvider}
                            >
                                <ProviderAvatar
                                    source={{ uri: provider.avatar_url }}
                                />
                                <ProviderName
                                    selected={provider.id === selectedProvider}
                                >
                                    {provider.name}
                                </ProviderName>
                            </ProviderContainer>
                        )}
                    />
                </ProvidersListContainer>
                <Calendar>
                    <Title>Escolha a data</Title>

                    <OpenButton onPress={handleToggleDatePicker}>
                        <OpenButtonText>Selecionar data</OpenButtonText>
                    </OpenButton>
                    {showDatePicker && (
                        <DateTimePicker
                            onChange={handleDateChange}
                            value={selectedDate}
                            mode="date"
                            display="calendar"
                            textColor="#f4ede8"
                        />
                    )}
                </Calendar>

                <Schedule>
                    <Title>Escolha o horário</Title>

                    <Section>
                        <SectionTitle>Manhã</SectionTitle>

                        <SectionContent>
                            {handleMorning.map(
                                ({ hourFormatted, hour, available }) => (
                                    <Hour
                                        enabled={available}
                                        selected={selectedHour === hour}
                                        onPress={() => handleSelectHour(hour)}
                                        available={available}
                                        key={hourFormatted}
                                    >
                                        <HourText
                                            selected={selectedHour === hour}
                                        >
                                            {hourFormatted}
                                        </HourText>
                                    </Hour>
                                ),
                            )}
                        </SectionContent>
                    </Section>

                    <Section>
                        <SectionTitle>Tarde</SectionTitle>

                        <SectionContent>
                            {handleAfternoon.map(
                                ({ hourFormatted, available, hour }) => (
                                    <Hour
                                        enabled={available}
                                        selected={selectedHour === hour}
                                        onPress={() => handleSelectHour(hour)}
                                        available={available}
                                        key={hourFormatted}
                                    >
                                        <HourText
                                            selected={selectedHour === hour}
                                        >
                                            {hourFormatted}
                                        </HourText>
                                    </Hour>
                                ),
                            )}
                        </SectionContent>
                    </Section>
                </Schedule>
                <CreateAppointmentButton onPress={handleCreateAppointment}>
                    <CreateAppointmentButtonText>
                        Agendar
                    </CreateAppointmentButtonText>
                </CreateAppointmentButton>
            </Content>
        </Container>
    );
};

export default CreateAppointment;
