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
import { FormHandles } from '@unform/core';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';
import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const handleSignUp = useCallback(
        async (data: SignUpFormData) => {
            try {
                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome é obrigatório'),
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                    password: Yup.string().min(6, 'No mínimo 6 letras'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await api.post('/users', data);

                Alert.alert(
                    'Cadastro realizado com sucesso!',
                    'Você já pode fazer login na aplicação',
                );

                navigation.goBack();

                // addToast({
                //     type: 'success',
                //     title: 'Cadastro realizado!',
                //     description: 'Você já pode fazer seu logon no GoBarber',
                // });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                }
                Alert.alert(
                    'Erro no cadastro',
                    'Ocorreu um erro ao fazer cadastro, cheque seus dados',
                );
            }
        },
        [navigation],
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
                        <Image source={logoImg} />
                        <View>
                            <Title>Crie sua conta</Title>
                        </View>
                        <Form ref={formRef} onSubmit={handleSignUp}>
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
                                    passwordInputRef.current?.focus()
                                }
                            />
                            <Input
                                ref={passwordInputRef}
                                secureTextEntry
                                name="password"
                                icon="lock"
                                placeholder="Senha"
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
                                Criar conta
                            </Button>
                        </Form>
                    </Container>
                </ScrollView>
                <BackToSignIn onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={20} color="#fff" />
                    <BackToSignInText>Voltar para login</BackToSignInText>
                </BackToSignIn>
            </KeyboardAvoidingView>
        </>
    );
};

export default SignUp;
