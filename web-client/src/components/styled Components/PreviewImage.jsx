import React, { useEffect } from 'react';

const PreviewImage = ({ base64Image, setBase64Image, image }) => {
    if (!image) return;
    useEffect(() => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            setBase64Image(reader.result);
        };
        // Clean up the FileReader on component unmount or if image changes
        return () => {
            reader.abort();
        };
    }, [image, setBase64Image]);

    return (
        <img src={base64Image} alt="avatar" />
    );
};

export default PreviewImage;
