import React, {useState} from 'react';

type Props = {
  maxFiles?: number;
  onChange?: (files: File[]) => void;
  initial?: File[];
};

export default function ImageUploader({maxFiles = 8, onChange, initial = []}: Props) {
  const [files, setFiles] = useState<File[]>(initial);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    const combined = [...files, ...selected].slice(0, maxFiles);
    setFiles(combined);
    onChange?.(combined);
  }

  function removeAt(i: number) {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    onChange?.(next);
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        aria-label="Upload images"
      />
      <div style={{display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap'}}>
        {files.map((f, i) => {
          const url = URL.createObjectURL(f);
          return (
            <div key={i} style={{position: 'relative'}}>
              <img src={url} alt={f.name} style={{width: 96, height: 96, objectFit: 'cover', borderRadius: 6}} />
              <button onClick={() => removeAt(i)} style={{position: 'absolute', top: 4, right: 4}}>x</button>
            </div>
          );
        })}
        {files.length < maxFiles && <div style={{alignSelf: 'center', color:'#666'}}>{files.length}/{maxFiles}</div>}
      </div>
    </div>
  );
}
