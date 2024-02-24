import { useState, useEffect, useContext } from 'react';

// Icon imports
import { IoMdClose } from 'react-icons/io';

// Context imports
import GeneralContext from '../../context/GeneralContext';

const PostImages2 = ({sources, inForm, handleDeleteImage}) => {
  const { handleImageToggler, mode } = useContext(GeneralContext);
  const [ deleteIndex, setDeleteIndex ] = useState(-1);


  const handleDeleteIndex = (event, index) => {
    event.stopPropagation();
    setDeleteIndex(index)
  };

  useEffect( () => {
    if (deleteIndex >= 0) {
      const timer = setTimeout( () => {
        setDeleteIndex(null);
        handleDeleteImage(sources[deleteIndex]);
      }, 400)

      return () => clearTimeout(timer);
    }
  }, [deleteIndex]);

  return (
    <div className='w-full h-auto flex space-x-1 transition-all'>
        { sources.map((source, index) => 
            <figure className={`relative w-6/12 h-32 opacity-90 hover:opacity-100 ${deleteIndex === index ? 'animate-element-shrink' : 'animate-image-grow'}  cursor-pointer`} key={index} onClick={() => handleImageToggler(sources, index)}>
                        { inForm && <div className={`absolute top-1 ${index === 0 ? 'left-1' : 'right-1'} rounded-full bg-${mode.color} text-white opacity-90 hover:opacity-100 z-10`} onClick={(event) => handleDeleteIndex(event,index)}>
            <IoMdClose className='text-4xl'/>
          </div>}
                <img src={source}  alt='post pic' className='w-full h-full object-cover rounded-xl opacity-90 hover:opacity-100'/>
            </figure>
            )}
    </div>
  )
}

export default PostImages2
