import { useState } from 'react';

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
  validator: Validator
): ValidatedField<N> => {
  const [isInitial, setIsInitial] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  return {
    name,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsInitial(false);
      if (validator.validate(e.target.value)) {
        setError(undefined);
      } else {
        setError(validator.message);
      }
      setValue(e.target.value);
    },
    error: error !== undefined,
    errorText: error || '',
    'data-initial': isInitial
  };
};

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
  email,
  nonEmptyString,
  password
};

export default validators;
