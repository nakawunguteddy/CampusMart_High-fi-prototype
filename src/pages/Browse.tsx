import React from 'react';

const categories = ['Books','Clothing','Electronics','Furniture','Other','Sports & Outdoors'];

// small mocked product list so items appear before sign-in
const sampleProducts = [
  { id: 'p1', title: 'Textbook: Intro to Algorithms', price: 80000, location: 'Makerere University', image: '/src/assets/logo.svg', rating: 4.6, verified: true },
  { id: 'p2', title: 'Used Jacket - Good Condition', price: 45000, location: 'Kampala', image: '/src/assets/logo.svg', rating: 4.2, verified: false },
  { id: 'p3', title: 'Smartphone (Unlocked)', price: 220000, location: 'Kampala', image: '/src/assets/logo.svg', rating: 4.8, verified: true },
];

const currency = new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 });

<<<<<<< HEAD
export default function Browse() {
  // products are rendered unconditionally so they appear for anonymous users as well
  return (
    <div style={{padding:20}}>
=======
// debug label to identify which file was rendered
const debugLabel = 'Loaded from: src/pages/Browse.tsx';

export default function Browse() {
  return (
    <div style={{padding:20}}>
      {/* debug label */}
      <div style={{fontSize:12, color:'#064e3b', background:'#ecfdf5', padding:'6px 8px', borderRadius:6, marginBottom:12}}>
        {debugLabel}
      </div>

>>>>>>> 362b35682c9f0b210142ef2199fce0406d64762f
      <div style={{display:'flex', gap:12, marginBottom:16, flexWrap:'wrap'}}>
        {categories.map(c => (
          <button key={c} style={{padding:'8px 12px', borderRadius:6, border:'1px solid #ddd'}}>{c}</button>
        ))}
      </div>

      {/* products visible even when not signed in */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16}}>
        {sampleProducts.map(p => (
          <article key={p.id} aria-label={p.title} style={{border:'1px solid #eee', borderRadius:8, overflow:'hidden', background:'#fff'}}>
            <img src={p.image} alt={`${p.title} image`} style={{width:'100%', height:140, objectFit:'cover'}} />
            <div style={{padding:12}}>
              <h3 style={{margin:0, fontSize:16, fontWeight:600}}>{p.title}</h3>
              <div style={{display:'flex', justifyContent:'space-between', marginTop:8, alignItems:'center'}}>
                <div style={{fontWeight:700}}>{currency.format(p.price)}</div>
                <div style={{display:'flex', gap:8, alignItems:'center', color:'#666'}}>
                  <span aria-hidden>★</span>
                  <span>{p.rating}</span>
                </div>
              </div>
              <div style={{marginTop:8, fontSize:13, color:'#666', display:'flex', alignItems:'center', gap:8}}>
                <span>{p.location}</span>
                {p.verified && <span title="Verified seller" aria-label="verified seller" style={{color:'#1e90ff'}}>✔️</span>}
              </div>
              <div style={{marginTop:12, display:'flex', gap:8}}>
                <button style={{flex:1}} onClick={()=>{/* navigate to product details */}}>View details</button>
                <button style={{padding:'6px 10px'}}>Add to favorites</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ...existing code for additional browse content... */}
    </div>
  );
}
