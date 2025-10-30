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
