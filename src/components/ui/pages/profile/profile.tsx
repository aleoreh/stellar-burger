import { FC } from 'react';

import { Button, Input } from '@zlden/react-developer-burger-ui-components';
import commonStyles from '../common.module.css';
import styles from './profile.module.css';

import { ProfileMenu } from '@components';
import validators, {
  useFormValidation,
  useValidatedField
} from '../../../../hooks/validationHooks';
import { ProfileUIProps } from './type';

export const ProfileUI: FC<ProfileUIProps> = ({
  formValue,
  isFormChanged,
  updateUserError,
  handleSubmit,
  handleCancel,
  handleInputChange
}) => {
  const nameInput = useValidatedField(
    'name',
    formValue.name,
    () => {},
    validators.nonEmptyString,
    handleInputChange
  );

  const emailInput = useValidatedField(
    'email',
    formValue.email,
    () => {},
    validators.email,
    handleInputChange
  );

  const passwordInput = useValidatedField(
    'password',
    formValue.password,
    () => {},
    validators.password,
    handleInputChange
  );

  const { inputs, isValid, resetInputsErrors } = useFormValidation({
    name: nameInput,
    email: emailInput,
    password: passwordInput
  });

  return (
    <main className={`${commonStyles.container}`}>
      <div className={`mt-30 mr-15 ${styles.menu}`}>
        <ProfileMenu />
      </div>
      <form
        className={`mt-30 ${styles.form} ${commonStyles.form}`}
        onSubmit={handleSubmit}
      >
        <>
          <div className='pb-6'>
            <Input
              {...inputs.name.attributes}
              type={'text'}
              placeholder={'Имя'}
              size={'default'}
              icon={'EditIcon'}
            />
          </div>
          <div className='pb-6'>
            <Input
              {...inputs.email.attributes}
              type={'email'}
              placeholder={'E-mail'}
              size={'default'}
              icon={'EditIcon'}
            />
          </div>
          <div className='pb-6'>
            <Input
              {...inputs.password.attributes}
              type={'password'}
              placeholder={'Пароль'}
              size={'default'}
              icon={'EditIcon'}
            />
          </div>
          {isFormChanged && (
            <div className={styles.button}>
              <Button
                type='secondary'
                htmlType='button'
                size='medium'
                onClick={handleCancel}
              >
                Отменить
              </Button>
              <Button
                type='primary'
                size='medium'
                htmlType='submit'
                disabled={!isValid}
              >
                Сохранить
              </Button>
            </div>
          )}
          {updateUserError && (
            <p
              className={`${commonStyles.error} pt-5 text text_type_main-default`}
            >
              {updateUserError}
            </p>
          )}
        </>
      </form>
    </main>
  );
};
