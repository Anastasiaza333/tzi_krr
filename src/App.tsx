import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import SteganographyForm from './components/SteganographyForm';

const App: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    return (
        <div>
            <h1>Steganography in Browser</h1>
            <ImageUploader setImage={setImage} />
            {image && <SteganographyForm image={image} />}
        </div>
    );
};

export default App;
