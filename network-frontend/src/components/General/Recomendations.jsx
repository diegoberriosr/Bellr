import { useContext } from 'react';

// Component imports
import Searchbar from './Searchbar';

// Context imports
import GeneralContext from '../../context/GeneralContext';


const Recomendations = () => {

    const {mode } = useContext(GeneralContext);

    return <section className='hidden lg:block sticky top-0 right-0 p-0.5 ml-7 w-[145px] md:w-[290px] xl:w-[350px] h-screen flex flex-col'>
       
        <Searchbar/>
 
        <div className={`flex flex-col ${mode.subBackground} ${mode.text} w-full rounded-xl p-4 mt-4`}>
            <h3 className='text-xl font-extrabold'>You might like</h3>
            <div>
                <div className='w-full mt-3 mb-2'>
                    <img src='https://th.bing.com/th/id/OIP.qSKOFXBeCLkB7oQ-sgA_6QAAAA?rs=1&pid=ImgDetMain' className='object-fit' alt='person programming'/>
                </div>
                <a href='https://cs50.harvard.edu/web/2020/' className='text-sm font-semibold cursor-pointer hover:underline'>CS50's intro to web programming</a>
                <p className='text-xs mt-2 block'>
                    This course picks up where CS50x leaves off, diving more deeply into the design and 
                    implementation of web apps with Python, JavaScript, and SQL using frameworks like Django, 
                    React, and Bootstrap.
                </p>
            </div>
        </div>
    </section>
}

export default Recomendations