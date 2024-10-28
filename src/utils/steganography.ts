export function hideMessageInImage(imageData: ImageData, message: string): ImageData {
    const binaryMessage = Array.from(message).map(char =>
        char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('');

    const newImageData = new ImageData(imageData.width, imageData.height);
    const data = newImageData.data;

    let messageIndex = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            if (messageIndex < binaryMessage.length) {
                const bit = parseInt(binaryMessage[messageIndex], 10);
                data[i + j] = (imageData.data[i + j] & 0xFE) | bit;
                messageIndex++;
            } else {
                data[i + j] = imageData.data[i + j];
            }
        }
        data[i + 3] = imageData.data[i + 3]; // альфа-канал
    }

    return newImageData;
}
// src/utils/steganography.ts

export function revealMessageFromImage(imageData: ImageData): string {
    let binaryMessage = '';

    for (let i = 0; i < imageData.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            binaryMessage += (imageData.data[i + j] & 1).toString();
        }
    }

    const chars = binaryMessage.match(/.{1,8}/g)?.map(byte => String.fromCharCode(parseInt(byte, 2))) || [];
    return chars.join('');
}
