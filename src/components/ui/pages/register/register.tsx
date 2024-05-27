import {
  Button,
  Input,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import validators, {
  useFormValidation,
  useValidatedField
} from '../../../../hooks/validationHooks';
import styles from '../common.module.css';
import { RegisterUIProps } from './type';

export const RegisterUI: FC<RegisterUIProps> = ({
  errorText,
  email,
  setEmail,
  handleSubmit,
  password,
  setPassword,
  userName,
  setUserName
}) => {
  const nameInput = useValidatedField(
    'name',
    userName,
    setUserName,
    validators.nonEmptyString
  );

  const emailInput = useValidatedField(
    'email',
    email,
    setEmail,
    validators.email
  );

  const passwordInput = useValidatedField(
    'password',
    password,
    setPassword,
    validators.password
  );

  const form = useFormValidation([nameInput, emailInput, passwordInput]);

  return (
    <main className={styles.container}>
      <div className={`pt-6 ${styles.wrapCenter}`}>
        <h3 className='pb-6 text text_type_main-medium'>Регистрация</h3>
        <form
          className={`pb-15 ${styles.form}`}
          name='register'
          onSubmit={handleSubmit}
          noValidate
        >
          <>
            <div className='pb-6'>
              <Input
                {...nameInput}
                type='text'
                placeholder='Имя'
                size='default'
              />
            </div>
            <div className='pb-6'>
              <Input
                {...emailInput}
                type='email'
                placeholder='E-mail'
                size={'default'}
              />
            </div>
            <div className='pb-6'>
              <PasswordInput {...passwordInput} />
            </div>
            <div className={`pb-6 ${styles.button}`}>
              <Button
                type='primary'
                size='medium'
                htmlType='submit'
                disabled={!form.isValid}
              >
                Зарегистрироваться
              </Button>
            </div>
            {errorText && (
              <p className={`${styles.error} text text_type_main-default pb-6`}>
                {errorText}
              </p>
            )}
          </>
        </form>
        <div className={`${styles.question} text text_type_main-default pb-6`}>
          Уже зарегистрированы?
          <Link to='/login' className={`pl-2 ${styles.link}`}>
            Войти
          </Link>
        </div>
      </div>
    </main>
  );
};
