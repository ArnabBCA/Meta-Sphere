import React from 'react'

const PreviewImage = ({base64Image,setBase64Image,image}) => {
    const reader=new FileReader();
    reader.readAsDataURL(image);
    reader.onload=()=>{
        setBase64Image(reader.result);
    };
    return (
    <>
        <img src={base64Image} alt="avatar" />
    </>
  )
}

export default PreviewImage