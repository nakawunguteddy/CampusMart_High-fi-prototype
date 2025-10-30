import React, {useState} from 'react';
import PasswordField from '../components/PasswordField';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [contactMethods, setContactMethods] = useState({chat: true, email: false, phone: false});

  return (
    <div style={{maxWidth:420, margin:'24px auto'}}>
      <h2>Sign in</h2>
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <PasswordField value="" onChange={()=>{}} />
      <div style={{marginTop:12}}>
        <div>Preferred contact</div>
        <label><input type="checkbox" checked={contactMethods.chat} onChange={_=>setContactMethods(m=>({...m,chat: !m.chat}))} /> CampusMart chat</label>
        <label style={{marginLeft:8}}><input type="checkbox" checked={contactMethods.email} onChange={_=>setContactMethods(m=>({...m,email: !m.email}))} /> Email</label>
        <label style={{marginLeft:8}}><input type="checkbox" checked={contactMethods.phone} onChange={_=>setContactMethods(m=>({...m,phone: !m.phone}))} /> Phone</label>
      </div>
      <button style={{marginTop:12}}>Sign in</button>
    </div>
  );
}
