import { useContext, useState, useEffect } from 'react';


import { IoMdClose } from 'react-icons/io';


import GeneralContext from '../../context/GeneralContext';


const PostImages4 = ( { sources, inForm, handleDeleteImage }) => {
  const { handleImageToggler, mode } = useContext(GeneralContext);
  const [ deleteIndex, setDeleteIndex ] = useState(-1);

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
    <div className='w-auto h-auto flex flex-col space-y-1 transition-all'>
    <div className='w-full h-full flex space-x-1'>
      <figure className={`relative w-6/12 h-full opacity-90 hover:opacity-100 ${deleteIndex === 0 ? 'animate-element-shrink' : 'animate-image-grow'}`} onClick={(event) => {handleImageToggler(sources, 0)}}>
        { inForm && <div className={`absolute top-1 left-1 rounded-full bg-${mode.color} opacity-90 hover:opacity-100 z-10`} onClick={(event) => { event.stopPropagation(); setDeleteIndex(0)}}>
            <IoMdClose className='text-4xl'/>
          </div>}
        <img src={sources[0]} alt='post pic' className='w-full h-full object-cover rounded-lg opacity-90 hover:opacity-100'/>
      </figure>
      <figure className={`relative w-6/12 h-full opacity-90 hover:opacity-100 ${deleteIndex === 1 ? 'animate-element-shrink' : 'animate-image-grow'} z-10`} onClick={() => handleImageToggler(sources, 1)}>
      { inForm && <div className={`absolute top-1 right-1 rounded-full bg-${mode.color} opacity-90 hover:opacity-100 z-10`} onClick={(event) => { event.stopPropagation(); setDeleteIndex(1)}}>
            <IoMdClose className='text-4xl'/>
          </div>}
        <img src={sources[1]} alt='post pic' className='w-full h-full object-cover rounded-lg opacity-90 hover:opacity-100'/>
      </figure>
    </div>
    <div className='w-full h-32 flex space-x-1'>
      <figure className={`relative w-6/12 h-full opacity-90 hover:opacity-100 ${deleteIndex === 2 ? 'animate-element-shrink' : 'animate-image-grow'}`} onClick={() => handleImageToggler(sources, 2)}>
      { inForm && <div className={`absolute top-1 left-1 rounded-full bg-${mode.color} opacity-90 hover:opacity-100 animate-grow z-10`} onClick={(event) => { event.stopPropagation(); setDeleteIndex(2)}}>
            <IoMdClose className='text-4xl'/>
          </div>}
        <img src={sources[2]} alt='post pic' className='w-full h-full object-cover rounded-lg opacity-90 hover:opacity-100'/>
      </figure>
      <figure className={`relative w-6/12 h-full opacity-90 flex justify-center items-center hover:opacity-100 ${deleteIndex === 3 ? 'animate-element-shrink' : 'animate-image-grow'}`} onClick={() => handleImageToggler(sources, 3)}>
      { inForm && <div className={`absolute top-1 right-1 rounded-full bg-${mode.color} opacity-90 hover:opacity-100 z-10`} onClick={(event) => { event.stopPropagation(); setDeleteIndex(3)}}>
            <IoMdClose className='text-4xl'/>
          </div>}
        <img src={sources[3]} alt='post pic' className={`w-full h-full object-cover rounded-lg opacity-90 hover:opacity-100 ${sources.length > 4 ? 'blur-sm' : ''}`}/>
        { sources.length > 4 && <span className='absolute text-5xl'>+{sources.length-4}</span>}
      </figure>
    </div>
    </div>
  )
}

export default PostImages4
