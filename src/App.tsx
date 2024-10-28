// src/App.tsx

import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import SteganographyForm from './components/SteganographyForm';
import ResultViewer from './components/ResultViewer';

const App: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [result, setResult] = useState<string | null>(null);

    return (
        <div className="app-container">
            <h1>Steganography in Browser</h1>
            <ImageUploader setImage={setImage} />
            {image && (
                <SteganographyForm
                    image={image}
                    setResult={setResult}
                />
            )}
            <ResultViewer result={result} />
        </div>
    );
};

export default App;
