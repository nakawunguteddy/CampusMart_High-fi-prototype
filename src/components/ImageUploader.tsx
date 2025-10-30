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