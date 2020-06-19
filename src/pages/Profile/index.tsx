import React, { useCallback, useRef } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    View,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { FormHandles } from '@unform/core';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import {
    Container,
    Title,
    UserAvatarButton,
    UserAvatar,
    BackButton,
} from './styles';
import { useAuth } from '../../hooks/Auth';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
    old_password: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {
    const navigation = useNavigation();
    const { user, updateUser } = useAuth();
    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>(null);
    const oldPasswordInputRef = useRef<TextInput>(null);
    const confirmPasswordInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleUpdateAvatar = useCallback(() => {
        ImagePicker.showImagePicker(
            {
                title: 'Selecione um avatar',
                cancelButtonTitle: 'Cancelar',
                takePhotoButtonTitle: 'Usar câmera',
                chooseFromLibraryButtonTitle: 'Escolher da galeria',
            },
            response => {
                if (response.didCancel) {
                    return;
                }
                if (response.error) {
                    Alert.alert('Erro ao atualizar seu avatar');
                    return;
                }

                const data = new FormData();

                data.append('avatar', {
                    type: 'image/jpeg',
                    name: `${user.id}.jpg`,
                    uri: response.uri,
                });

                api.patch('users/avatar', data).then(res => {
                    updateUser(res.data);
                });
            },
        );
    }, [updateUser, user.id]);

    const handleSignUp = useCallback(
        async (data: SignUpFormData) => {
            try {
                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome é obrigatório'),
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                    password: Yup.string().when('old_password', {
                        is: val => !!val.length,
                        then: Yup.string().required(),
                        otherwise: Yup.string(),
                    }),
                    old_password: Yup.string().required(),
                    password_confirmation: Yup.string()
                        .when('old_password', {
                            is: val => !!val.length,
                            then: Yup.string().required(),
                            otherwise: Yup.string(),
                        })
                        .oneOf(
                            [Yup.ref('password'), null],
                            'Senhas precisam ser iguais',
                        ),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const {
                    name,
                    email,
                    old_password,
                    password,
                    password_confirmation,
                } = data;

                const formData = {
                    name,
                    email,
                    ...(old_password
                        ? {
                              old_password,
                              password,
                              password_confirmation,
                          }
                        : {}),
                };

                const response = await api.put('/profile', formData);

                updateUser(response.data);

                Alert.alert('Perfil atualizado com sucesso!');

                navigation.goBack();
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                }
                Alert.alert(
                    'Erro na atualização do perfil',
                    'Ocorreu um erro ao atualizar seu perfil, cheque seus dados',
                );
            }
        },
        [navigation, updateUser],
    );
    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
            >
                <ScrollView
                    contentContainerStyle={{ flex: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Container>
                        <BackButton onPress={handleGoBack}>
                            <Icon
                                name="chevron-left"
                                size={24}
                                color="#999591"
                            />
                        </BackButton>
                        <UserAvatarButton onPress={handleUpdateAvatar}>
                            <UserAvatar source={{ uri: user.avatar_url }} />
                        </UserAvatarButton>
                        <View>
                            <Title>Meu Perfil</Title>
                        </View>
                        <Form
                            ref={formRef}
                            initialData={{ name: user.name, email: user.email }}
                            onSubmit={handleSignUp}
                        >
                            <Input
                                name="name"
                                icon="user"
                                placeholder="Nome"
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    emailInputRef.current?.focus()
                                }
                            />
                            <Input
                                returnKeyType="next"
                                ref={emailInputRef}
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                name="email"
                                icon="mail"
                                placeholder="E-mail"
                                onSubmitEditing={() =>
                                    oldPasswordInputRef.current?.focus()
                                }
                            />
                            <Input
                                ref={oldPasswordInputRef}
                                secureTextEntry
                                containerStyle={{ marginTop: 16 }}
                                name="old_password"
                                icon="lock"
                                placeholder="Senha atual"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                            />

                            <Input
                                ref={passwordInputRef}
                                secureTextEntry
                                name="password"
                                icon="lock"
                                placeholder="Nova Senha"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    confirmPasswordInputRef.current?.focus();
                                }}
                            />

                            <Input
                                ref={confirmPasswordInputRef}
                                secureTextEntry
                                name="password_confirmation"
                                icon="lock"
                                placeholder="Confirmar Senha"
                                returnKeyType="send"
                                onSubmitEditing={() => {
                                    formRef.current?.submitForm();
                                }}
                            />

                            <Button
                                onPress={() => {
                                    formRef.current?.submitForm();
                                }}
                            >
                                Confirmar mudanças
                            </Button>
                        </Form>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

export default Profile;
