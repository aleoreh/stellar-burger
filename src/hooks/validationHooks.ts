import { useEffect, useState } from 'react';

type ValidatedField<N> = {
  name: N;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  errorText: string;
  'data-initial': boolean;
};

type Validate = (value: string) => boolean;

export type Validator = { validate: Validate; message: string };

const createValidator = (validate: Validate, message: string): Validator => ({
  validate,
  message
});

// ~~~~~~~~~~~~~~ validators ~~~~~~~~~~~~~ //

const alwaysValid: Validator = createValidator(() => true, '');

const email: Validator = createValidator(
  (value: string) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value),
  'Некорректный адрес электронной почты'
);

const nonEmptyString: Validator = createValidator(
  (value: string) => value.length > 0,
  'Поле должно быть заполнено'
);

const password: Validator = createValidator(
  (value) => value.length > 1,
  'Слишком короткий пароль'
);

// ~~~~~~~~~~~~~~~~ hooks ~~~~~~~~~~~~~~~~ //

export const useValidatedField = <N extends string>(
  name: N,
  value: string,
  setValue: (value: string) => void,
  validator: Validator,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
): ValidatedField<N> => {
  useEffect(() => {
    if (isInitial) {
      setIsInitial(false);
      return;
    }
    if (validator.validate(value)) {
      setError(undefined);
    } else {
      setError(validator.message);
    }
    setIsInitial(false);
  }, [value]);

  const [isInitial, setIsInitial] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  return {
    name,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsInitial(false);
      setValue(e.target.value);
      onChange?.(e);
    },
    error: error !== undefined,
    errorText: error || '',
    'data-initial': isInitial
  };
};

/**
 * 1. Создать поля валидации (useValidatedField)
 * 2. Подключить их в хук useFormValidation
 * 3. Применить к `form` и `input`
 *
 * ```typescript
  const nameInput = useValidatedField(
    'name',
    name,
    setName,
    validators.nonEmptyString
  );
  const passwordInput = useValidatedField(
    'password',
    password,
    setPassword,
    validators.password
  );
  const { inputs, isValid } = useFormValidation({
    name: nameInput,
    password: passwordInput
  });
  <form>
    <Input {...inputs.name} />
    <Input {...inputs.password} />
    <Button disabled={!isValid}>Отправить</Button>
  </form>
 * ```
 */
export const useFormValidation = <
  T extends {},
  K extends keyof T,
  N extends string
>(inputs: {
  [K in keyof T]: ValidatedField<N>;
}) => {
  let isValid = true;
  for (const key of Object.keys(inputs) as K[]) {
    isValid = isValid && !inputs[key]['data-initial'] && !inputs[key].error;
  }
  return {
    inputs,
    isValid
  };
};

// ~~~~~~~~~~~~~~~ exports ~~~~~~~~~~~~~~~ //

export const validators = {
  alwaysValid,
  email,
  nonEmptyString,
  password
};

export default validators;
