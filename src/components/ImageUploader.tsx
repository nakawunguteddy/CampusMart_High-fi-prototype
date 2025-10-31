<<<<<<< HEAD
import React, { useState } from 'react';

interface ImageUploaderProps {
    onChange: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange }) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const filesArray = Array.from(selectedFiles);
            // Enforce maxFiles = 8
            if (filesArray.length > 8) {
                alert('You can only upload a maximum of 8 files.');
                return;
            }
            // File-size/type checks can be implemented here
            setFiles(filesArray);
            onChange(filesArray);
        }
    };

    const handleRemoveFile = (file: File) => {
        const updatedFiles = files.filter(f => f !== file);
        setFiles(updatedFiles);
        onChange(updatedFiles);
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                aria-label="Image uploader"
            />
            <div>
                {files.map(file => (
                    <div key={file.name}>
                        <img src={URL.createObjectURL(file)} alt={file.name} width={100} />
                        <button onClick={() => handleRemoveFile(file)}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;
=======
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
>>>>>>> 362b35682c9f0b210142ef2199fce0406d64762f
