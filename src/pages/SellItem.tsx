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
