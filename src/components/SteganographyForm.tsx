import React, { useState } from 'react';
import LZString from 'lz-string';

const hideMessageInImage = (imageData: ImageData, message: string): ImageData => {
    const data = imageData.data;
    const messageBits = message.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    const messageLength = messageBits.length;

    if (messageLength > data.length / 4) {
        throw new Error("Повідомлення занадто велике для цього зображення.");
    }

    for (let i = 0; i < messageLength; i++) {
        const bit = messageBits[i];
        data[i * 4] = (data[i * 4] & 0xFE) | parseInt(bit); // red channel
    }

    return imageData;
};

const revealMessageFromImage = (imageData: ImageData): string => {
    let binaryMessage = '';

    // Спочатку витягуємо довжину
    let lengthBits = '';
    for (let i = 0; i < 16; i++) {
        lengthBits += (imageData.data[i * 4] & 1).toString(); // red channel
    }
    const messageLength = parseInt(lengthBits, 2);

    // Потім витягуємо повідомлення
    for (let i = 0; i < messageLength * 8; i += 4) {
        binaryMessage += (imageData.data[i + 16 * 4] & 1).toString(); // red channel
    }

    const chars = binaryMessage.match(/.{1,8}/g)?.map(byte => String.fromCharCode(parseInt(byte, 2))) || [];
    return chars.join('');
};


interface SteganographyFormProps {
    image: HTMLImageElement;
    setResult: React.Dispatch<React.SetStateAction<string | null>>;
}

const SteganographyForm: React.FC<SteganographyFormProps> = ({ image, setResult }) => {
    const [message, setMessage] = useState('');

    const handleHideMessage = () => {
        if (!message) {
            alert('Введіть повідомлення для приховування');
            return;
        }
        const compressedMessage = LZString.compress(message);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const newImageData = hideMessageInImage(imageData, compressedMessage);
        context.putImageData(newImageData, 0, 0);

        setResult(canvas.toDataURL());
    };

    const handleRevealMessage = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const hiddenMessage = revealMessageFromImage(imageData);
        const decompressedMessage = LZString.decompress(hiddenMessage);

        setResult(decompressedMessage || 'Немає прихованого повідомлення');
    };

    return (
        <div>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введіть повідомлення для приховування"
            />
            <button onClick={handleHideMessage}>Приховати повідомлення</button>
            <button onClick={handleRevealMessage}>Витягти повідомлення</button>
        </div>
    );
};

export default SteganographyForm;
