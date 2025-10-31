<<<<<<< HEAD
import React, { useState } from 'react';
import { PasswordField } from 'your-password-field-component'; // Adjust the import based on your project structure

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        avatar: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    avatar: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <PasswordField
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Profile Picture:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                    {formData.avatar && (
                        <div>
                            <img
                                src={formData.avatar}
                                alt="Avatar Preview"
                                style={{ width: '100px', height: '100px' }}
                            />
                        </div>
                    )}
                </div>
                <div>
                    <button type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
=======
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
>>>>>>> 362b35682c9f0b210142ef2199fce0406d64762f
