import React, {useState} from 'react';

export default function Profile() {
  const [name, setName] = useState('Your Name');
  const [location, setLocation] = useState('Makerere University');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [verified] = useState(true);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setAvatar(URL.createObjectURL(f));
  }

  // debug label to identify which file was rendered
  const debugLabel = 'Loaded from: src/pages/Profile.tsx';

  return (
    <div style={{maxWidth:720, margin:'24px auto'}}>
      {/* debug label */}
      <div style={{fontSize:12, color:'#064e3b', background:'#ecfdf5', padding:'6px 8px', borderRadius:6, marginBottom:12}}>
        {debugLabel}
      </div>

      <div style={{display:'flex', gap:16, alignItems:'center'}}>
        {/* avatar with verification badge overlay */}
        <div
          style={{
            position:'relative',
            width:96,
            height:96,
            flex: '0 0 96px',
            overflow: 'visible' // ensure badge isn't clipped
          }}
        >
          <img
            src={avatar || '/src/assets/logo.svg'}
            alt="profile"
            style={{width:96, height:96, borderRadius:'50%', display:'block', objectFit:'cover'}}
          />
          {verified && (
            <span
              role="img"
              aria-label="Verified user"
              title="Verified user"
              style={{
                position: 'absolute',
                right: 6,            // moved inside the avatar bounds
                bottom: 6,           // moved inside the avatar bounds
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: '#1e90ff',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
                border: '2px solid white',
                zIndex: 2,
                fontSize: 14,
                lineHeight: 1
              }}
            >
              {/* check icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </div>

        <div>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <h2 style={{margin:0}}>{name}</h2>
            {/* verified student pill (updated to green with icon) */}
            {verified && (
              <span
                aria-hidden={false}
                role="status"
                title="Verified student"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  background: '#e6f9ee',
                  color: '#067a38',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  boxShadow: '0 1px 0 rgba(6,122,56,0.06)'
                }}
              >
                {/* small student/check icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <path d="M12 2c-4 0-8 2-8 4v3c0 2 4 4 8 4s8-2 8-4V6c0-2-4-4-8-4z" fill="#067a38" opacity="0.15"/>
                  <path d="M21 17.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2.5c0-1.9 3.6-3.5 8-3.5s8 1.6 8 3.5z" fill="#067a38" opacity="0.12"/>
                  <path d="M9.3 12.3l1.4 1.4 4.0-4.0" stroke="#067a38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                <span>Verified student</span>
              </span>
            )}
          </div>
          <div style={{color:'#666'}}>{location}</div>
          <div style={{marginTop:8}}>
            <label style={{display:'block'}}>Change picture<input type="file" accept="image/*" onChange={pick} /></label>
            <label style={{display:'block', marginTop:8}}>Location<input value={location} onChange={e=>setLocation(e.target.value)} /></label>
            <button style={{marginTop:8}}>Save profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}
