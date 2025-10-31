<<<<<<< HEAD
// Render avatar image, seller name, "Verified" icon when verified, location, and a Rate seller action
=======
import React from 'react';

type Props = {
  name: string;
  location?: string;
  verified?: boolean;
  avatarUrl?: string;
  onRate?: () => void;
};

export default function SellerCard({name, location, verified, avatarUrl, onRate}: Props) {
  return (
    <div style={{display:'flex', gap:12, alignItems:'center', padding:12, border:'1px solid #eee', borderRadius:8}}>
      <img src={avatarUrl || '/src/assets/logo.svg'} alt="seller" style={{width:56, height:56, borderRadius:'50%'}} />
      <div style={{flex:1}}>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <strong>{name}</strong>
          {verified && <span aria-label="verified" title="Verified" style={{color:'#1e90ff'}}>✔️</span>}
        </div>
        <div style={{fontSize:13, color:'#666'}}>{location}</div>
        <button onClick={onRate} style={{marginTop:8}}>Rate seller</button>
      </div>
    </div>
  );
}
>>>>>>> 362b35682c9f0b210142ef2199fce0406d64762f
