import { useContext, useState, useEffect } from 'react';

// Icon imports


import { IoMdArrowRoundBack, IoMdClose } from "react-icons/io";
import { IoMdArrowRoundForward } from "react-icons/io";

import GeneralContext from '../../context/GeneralContext';


const ImageToggler = ({ shrink, setShrink }) => {
  const { activeImageIndex, postImages, setActiveImageIndex} = useContext(GeneralContext);
  const [toggling, setToggling] = useState(false);

  const closeImageToggler = () => {
    setShrink(true);
  }

  const handleForward = () => {
    if ( activeImageIndex <  postImages.length -1 ) 
    {
      setToggling(!toggling);
      const timer = setTimeout( () =>   setActiveImageIndex(prevIndex => prevIndex+1), 250)
      
      return () => clearTimeout(timer);
    }
  }

  const handleBackwards = () => {

    if ( activeImageIndex > 0 ) {
      setToggling(!toggling);
      const timer = setTimeout( () => setActiveImageIndex(prevIndex => prevIndex -1), 250);
      
      return () => clearTimeout(timer);
    }
  }

  useEffect( () => {
    if (toggling) {
      const timer = setTimeout( () => {
        setToggling(!toggling);
      }, 250)

      return () => clearTimeout(timer);
    }
  }, [toggling])

  return (
    <div className={` w-full h-full flex flex-col ${shrink ? 'animate-shrink' : 'animate-grow'} px-10`}>
        <IoMdClose className='absolute right-3 text-2xl' onClick={closeImageToggler}/>
        <div className='relative w-full h-full flex items-center justify-center'>
          { activeImageIndex > 0 && <IoMdArrowRoundBack className='absolute left-0 text-8xl animate-grow' onClick={handleBackwards}/> }
          <figure className='max-w-[500px] max-h-[500px]'>
            <img src={postImages[activeImageIndex]} alt='post pic'  className={`${toggling ? 'animate-element-shrink' : 'animate-image-grow'} w-full h-full object-cover`}/>
          </figure>
          { activeImageIndex < postImages.length - 1 && <IoMdArrowRoundForward className='absolute right-0 text-8xl animate-grow' onClick={handleForward}/> }
        </div>
    </div>
  );
}

export default ImageToggler
