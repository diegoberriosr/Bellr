import { useState } from 'react';

const ImageInput = ({ setImages }) => {
  const [ image, setImage ] = useState(null);

  return (
    <input type='file' accept='image/*'/>
  )
}

export default ImageInput
