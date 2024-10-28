// src/components/ResultViewer.tsx

import React from 'react';

interface ResultViewerProps {
    result: string | null;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ result }) => {
    if (!result) return null;

    return (
        <div>
            {result.startsWith('data:image') ? (
                <img src={result} alt="Resulting image" />
            ) : (
                <p>Hidden Message: {result}</p>
            )}
        </div>
    );
};

export default ResultViewer;
