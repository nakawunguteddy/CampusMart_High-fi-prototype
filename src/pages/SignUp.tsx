import React, {useState} from 'react';
import PasswordField from '../components/PasswordField';

export default function SignUp() {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setAvatar(URL.createObjectURL(f));
  }

  return (
    <div style={{maxWidth:520, margin:'24px auto'}}>
      <h2>Sign up</h2>
      <label>Name<input value={name} onChange={e=>setName(e.target.value)} /></label>
      <label>Profile picture
        <input type="file" accept="image/*" onChange={pick} />
      </label>
      {avatar && <img src={avatar} alt="avatar" style={{width:72, height:72, borderRadius:'50%'}} />}
      <label>Email<input /></label>
      <PasswordField />
      <button style={{marginTop:12}}>Create account</button>
    </div>
  );
}
