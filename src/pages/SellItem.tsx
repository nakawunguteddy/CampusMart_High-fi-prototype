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