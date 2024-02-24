import { useState, useEffect, useContext } from 'react';

// Icon imports
import { IoMdClose } from 'react-icons/io';

// Context imports
import GeneralContext from '../../context/GeneralContext';


const PostImages1 = ({sources, handleDeleteImage, inForm}) => {
  const { handleImageToggler, mode} = useContext(GeneralContext);
  const [deleting, setDeleting ] = useState(null);

    const handleDeleting = (event) => {
        event.stopPropagation();
        setDeleting(!deleting);
    }

  useEffect(() => {
    if(deleting){
      setTimeout(() => {
        setDeleting(false);
        handleDeleteImage(sources);
      }, 250)
    }
  }, [deleting])

  return (
    <figure className={`relative h-full w-full opacity-90 hover:opacity-100 rounded-lg cursor-pointer transition-all duration-500 ${ deleting ? 'animate-element-shrink' : 'animate-image-grow' }`} onClick={() => handleImageToggler(sources, 0)}>
      { inForm && <div className={`absolute top-1 right-1 rounded-full bg-${mode.color} text-white opacity-90 hover:opacity-100 z-10`} onClick={(event) => handleDeleting(event)}>
            <IoMdClose className='text-4xl'/>
      </div>}
      <img src={sources} alt='post pic' className='w-full h-full object-cover animate-image-grow rounded-xl'/>
    </figure>
  )
}

export default PostImages1
