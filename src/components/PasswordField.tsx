<<<<<<< HEAD
import React, { useState } from 'react';

type Props = { label?: string; onChange?: (value: string) => void };

const PasswordField: React.FC<Props> = ({ label = 'Password', onChange }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => setIsPasswordVisible((v) => !v);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div>
      <label>
        {label}
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          aria-label={label}
        />
      </label>
      <button
        type="button"
        onClick={togglePasswordVisibility}
        aria-pressed={isPasswordVisible}
        aria-label={`Toggle ${isPasswordVisible ? 'hide' : 'show'} password`}
      >
        {isPasswordVisible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

export default PasswordField;
=======
import React, {useState, InputHTMLAttributes} from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function PasswordField({label = 'Password', ...rest}: Props) {
  const [show, setShow] = useState(false);
  return (
    <label style={{display: 'block', marginBottom: 8}}>
      <div style={{marginBottom: 4}}>{label}</div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <input
          type={show ? 'text' : 'password'}
          {...rest}
          style={{flex: 1, padding: '8px 12px'}}
        />
        <button
          type="button"
          aria-label="toggle password"
          onClick={() => setShow(s => !s)}
          style={{marginLeft: 8}}
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
    </label>
  );
}
>>>>>>> 362b35682c9f0b210142ef2199fce0406d64762f
