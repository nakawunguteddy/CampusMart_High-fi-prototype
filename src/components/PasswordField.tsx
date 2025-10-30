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
