import { useState, useEffect, useContext } from 'react';

// Icon imports
import { IoMdClose } from 'react-icons/io';

// Context imports
import GeneralContext from '../../context/GeneralContext';

const PostImages3 = ({sources, inForm, handleDeleteImage}) => {

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteIndex]);

  return (
    <div className='w-full h-auto flex space-x-1 transition-all'>
    <figure className={`relative h-auto w-6/12  ${deleteIndex === 0 ? 'animate-element-shrink' : 'animate-image-grow'}`} onClick={() => handleImageToggler(sources, 0)} >
    { inForm && <div className={`absolute top-1 left-1 rounded-full bg-${mode.color} text-white opacity-90 hover:opacity-100 z-10`} onClick={(event) => handleDeleteIndex(event, 0)}>
            <IoMdClose className='text-4xl'/>
          </div>}
        <img src={sources[0]} alt='post pic' className='w-full h-full object-cover rounded-lg opacity-90 hover:opacity-100'/>
    </figure>
    <div className='flex flex-col w-6/12 h-full h-64 space-y-1'>
        { sources.slice(1,3).map( (source, index) => 
            <figure className={`relative h-6/12 w-full opacity-90 hover:opacity-100 ${deleteIndex === index + 1 ? 'animate-element-shrink' : 'animate-image-grow'}`} key={index} onClick={() => handleImageToggler(sources, index+1)}>
                  { inForm && <div className={`z-10 absolute top-1 right-1 rounded-full bg-${mode.color} text-white opacity-90 hover:opacity-100`} onClick={(event) => handleDeleteIndex(event, index + 1)} >
                       <IoMdClose className='text-4xl'/>
                     </div>}
                <img src={source} alt='post pic' className='w-full h-full object-cover rounded-lg opacity-90 hover:opacity-100'/>
            </figure>
        )}
    </div>
    </div>
  )
}

export default PostImages3
