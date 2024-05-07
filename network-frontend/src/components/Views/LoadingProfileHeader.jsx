import { useContext } from 'react';

// Component imports
import { MoonLoader } from 'react-spinners';

// Context imports
import GeneralContext from '../../context/GeneralContext';


const EmptyProfileHeader = () => {

    const { mode } = useContext(GeneralContext);
    

    return (
        <>
        <header className={`border ${mode.separator} border-l-0 w-full animate-pulse`}>
        <figure className='relative h-44 w-full '>
            <div className={`absolute h-full w-full z-10 ${mode.highlight}`}/>
            <div className={`absolute left-3 -bottom-16 w-[130px] h-[130px] rounded-full border ${mode.background} border-[3.5px] z-10`}/>
            <div className='absolute -bottom-10 right-3 flex items-center space-x-2'>
                    <div className={`w-[100px] h-8 ${mode.highlight} rounded-full`}/>
                    <div className={`w-[100px] h-8 ${mode.highlight} rounded-full`}/>
            </div>
        </figure>
        <div className='px-4 pt-20'>
            <div className={`text-2xl font-bold flex items-center w-[200px] rounded-full ${mode.highlight}`}/>
            <div className='text-base text-gray-600'/>
            <div className='mt-2.5 text-base'/>
            <div className='flex items-center space-x-[2%] text-gray-600 mt-1.5 w-full'>
                    <div className={`w-[20%] h-5 rounded-full ${mode.highlight}`}/>
                    <div className={`w-[35%] h-5 rounded-full ${mode.highlight}`}/>
                    <div className={`w-[15%] h-5 rounded-full ${mode.highlight}`}/>
            </div>
            <div className='flex text-sm space-x-5 mt-1.5'>
                <p className={`cursor-pointer w-20 h-5 ${mode.highlight} rounded-full`} />
                <p className={`cursor-pointer w-20 h-5 ${mode.highlight} rounded-full`} />
            </div>
        </div>
        <ul className='w-full h-12 flex mt-2.5 cursor-pointer'>
            <li className={`relative w-4/12 h-2/12 flex items-center justify-center text-xs mobile:text-base hover:${mode.sidebarHighlight} hover:opacity-50`}>
                <span className={`h-10 w-8/12 h-5 rounded-full ${mode.highlight}`}/>
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-xs mobile:text-base hover:${mode.sidebarHighlight} hover:opacity-50`}>
                 <span className={`h-10 w-8/12 h-5 rounded-full ${mode.highlight}`}/>
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-xs mobile:text-base hover:${mode.sidebarHighlight} hover:opacity-50`} >
                <span className={`h-10 w-8/12 h-5 rounded-full ${mode.highlight}`}/>

            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-xs mobile:text-base hover:${mode.sidebarHighlight} hover:opacity-50`} >
              <span className={`h-10 w-8/12 h-5 rounded-full ${mode.highlight}`}/>
            </li>
        </ul>
    </header>
    <div className='w-full mt-10 flex justify-center'>
            <MoonLoader loading={true} color={mode.spinnerColor} size={75}/>
     </div>
     </>
    );
}


export default EmptyProfileHeader;