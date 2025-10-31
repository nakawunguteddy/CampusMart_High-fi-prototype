<<<<<<< HEAD
```tsx
// Title: <h2>Post Item</h2>
// Price UI: show UGX label and use Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }) when displaying
// Conditions: ['Used - Like New','Used - Good','Used - Acceptable','For parts'] (NO "New")
// Images: use <ImageUploader maxFiles={8} />
// Preferred contact: chat checkbox default checked
// Submit button text: "Post Item"

import React, { useState } from 'react';
import ImageUploader from 'react-images-upload';

const SellItem = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [condition, setCondition] = useState('');
    const [images, setImages] = useState([]);
    const [contactMethod, setContactMethod] = useState('chat');

    const handleImageUpload = (newImages) => {
        if (newImages.length <= 8) {
            setImages(newImages);
        } else {
            alert('You can upload a maximum of 8 images.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div>
            <h2>Post Item</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Price (UGX):
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Condition:
                        <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            required
                        >
                            <option value="">Select condition</option>
                            <option value="Used - Like New">Used - Like New</option>
                            <option value="Used - Good">Used - Good</option>
                            <option value="Used - Acceptable">Used - Acceptable</option>
                            <option value="For parts">For parts</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Images:
                        <ImageUploader
                            withIcon={true}
                            buttonText='Choose images'
                            onChange={handleImageUpload}
                            imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
                            maxFileSize={5242880}
                            maxFiles={8}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Preferred contact method:
                        <input
                            type="checkbox"
                            checked={contactMethod === 'chat'}
                            onChange={() => setContactMethod(contactMethod === 'chat' ? '' : 'chat')}
                        />
                        Chat
                    </label>
                </div>
                <button type="submit">Post Item</button>
            </form>
        </div>
    );
};

export default SellItem;
```
=======
import React, {useState} from 'react';
import ImageUploader from '../components/ImageUploader';

export default function SellItem() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [condition, setCondition] = useState('Used - Like New');
  const [contact, setContact] = useState({chat:true, email:false, phone:false});
  const [images, setImages] = useState<File[]>([]);

  const conditions = ['Used - Like New','Used - Good','Used - Acceptable','For parts'];

  return (
    <div style={{maxWidth:720, margin:'24px auto'}}>
      <h2>Post Item</h2>
      <label>Title<input value={title} onChange={e=>setTitle(e.target.value)} /></label>
      <label>Price (UGX)
        <div style={{display:'flex', alignItems:'center'}}>
          <span style={{padding:'8px 12px', background:'#f4f4f4', border:'1px solid #ddd'}}>UGX</span>
          <input type="number" value={price as any} onChange={e=>setPrice(e.target.value ? Number(e.target.value) : '')} style={{flex:1}} />
        </div>
      </label>
      <label>Condition
        <select value={condition} onChange={e=>setCondition(e.target.value)}>
          {conditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label>Images</label>
      <ImageUploader maxFiles={8} onChange={setImages} />
      <div style={{marginTop:12}}>
        <div>Preferred contact</div>
        <label><input type="checkbox" checked={contact.chat} onChange={_=>setContact(c=>({...c,chat:!c.chat}))} /> CampusMart chat</label>
        <label style={{marginLeft:8}}><input type="checkbox" checked={contact.email} onChange={_=>setContact(c=>({...c,email:!c.email}))} /> Email</label>
        <label style={{marginLeft:8}}><input type="checkbox" checked={contact.phone} onChange={_=>setContact(c=>({...c,phone:!c.phone}))} /> Phone</label>
      </div>
      <button style={{marginTop:16}}>Post Item</button>
    </div>
  );
}
>>>>>>> 362b35682c9f0b210142ef2199fce0406d64762f
