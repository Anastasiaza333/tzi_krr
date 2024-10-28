import React, { useState } from 'react';
import { hideMessageInImage, revealMessageFromImage } from '../utils/steganography';

const SteganographyForm: React.FC<{ image: HTMLImageElement }> = ({ image }) => {
    const [message, setMessage] = useState('');
    const [result, setResult] = useState('');

    const handleHideMessage = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, image.width, image.height);
        const newImageData = hideMessageInImage(imageData, message);
        context.putImageData(newImageData, 0, 0);

        setResult(canvas.toDataURL());
    };

    const handleRevealMessage = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, image.width, image.height);
        const hiddenMessage = revealMessageFromImage(imageData);

        setResult(hiddenMessage);
    };

    return (
        <div>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message to hide"
            />
            <button onClick={handleHideMessage}>Hide Message</button>
            <button onClick={handleRevealMessage}>Reveal Message</button>
            {result && <img src={result} alt="Resulting image with hidden message" />}
        </div>
    );
};

export default SteganographyForm;
