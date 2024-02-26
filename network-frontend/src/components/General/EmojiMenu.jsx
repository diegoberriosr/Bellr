import { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';

// Icon imports
import { BsEmojiSmile } from "react-icons/bs";

// Context imports
import GeneralContext from '../../context/GeneralContext';

const EmojiMenu = ({ content, setFieldValue }) => {
  
  const [ isVisible, setIsVisible ] = useState(false);
  const [ emojis, setEmojis ] = useState([]);
  const [ displayedEmojis, setDisplayedEmojis] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ category, setCategory ] = useState('all');

  const { mode } = useContext(GeneralContext);
  
  const { values, handleChange, handleBlur } = useFormik({
    initialValues : {
        search : ''
    },
  })


  const handleFilter = (group) => {
    if (group === 'all') {
        setDisplayedEmojis(emojis);
    }

    setDisplayedEmojis(emojis.filter(emoji => emoji.group === group));
  }

  const insertEmoji = (emoji) => {
    setFieldValue('content', content + emoji);
  }

  useEffect( () => {
    setDisplayedEmojis(emojis.filter( emoji => emoji.unicodeName.toUpperCase().includes(values.search.toUpperCase())))
  }, [values.search])

  const hoverColors = {
    'bg-light-sidebar-highlight': 'hover:bg-light-sidebar-highlight',
    'bg-dim-sidebar-highlight' : 'hover:bg-dim-sidebar-highlight',
    'bg-dark-sidebar-highlight' : 'hover:bg-dark-sidebar-highlight'
}

 const hoverClass = hoverColors[mode.sidebarHighlight];  


  useEffect( () => {
      setLoading(true);
      
      if ( isVisible && emojis.length === 0) {
        console.log('calling api...')
        axios({
            url : 'https://emoji-api.com/emojis?access_key=41a0c799cfbd0b093ef290f66d002d48ec7f2aab',
            method : 'GET',
        })
        .then( res => {
            setEmojis(res.data);
            setDisplayedEmojis(res.data);
        })
    }
    setLoading(false);
  }, [isVisible])

  return (
    <div className='relative flex flex-col justify-center items-center'>
        <BsEmojiSmile className='cursor-pointer' onClick={() => setIsVisible(!isVisible)}/>
        { isVisible && <div className={`absolute top-5 w-[300px] bg-${mode.background} p-2.5 border ${mode.separator} shadow-custom z-50 rounded-xl animate-grow`} onMouseLeave={() => setIsVisible(false)}>
            <ul className='w-full flex items-center justify-between transition-colors duration-300'>
                <li className={`${hoverClass} cursor-pointer`} onClick={() => handleFilter('all')}>
                    🌐
                </li>
                <li className={`${hoverClass} cursor-pointer`} onClick={() => handleFilter('smileys-emotion')}>
                    😀
                </li>
                <li className={`${hoverClass} cursor-pointer`} onClick={() => handleFilter('people-body')}>
                    👋
                </li>
                <li className={`${hoverClass} cursor-pointer`} onClick={() => handleFilter('animals-nature')}>
                    🌲
                </li>
                <li className={`${hoverClass} cursor-pointer`} onClick={() => handleFilter('food-drink')}>
                    🍔
                </li>
                <li className={`${hoverClass} cursor-pointer`} onClick={() => handleFilter('objects')}>
                    💡
                </li>
                <li className={`${hoverClass} cursor-pointer`} onClick={() => handleFilter('travel-places')}>
                    ✈️
                </li>
                <li className={`${hoverClass} cursor-pointer`} onClick={() => handleFilter('symbols')}>
                    ㊗️  
                </li>
                <li className={`${hoverClass} cursor-pointer`} onClick={() => handleFilter('flags')}>
                    🌎
                </li>
            </ul>
            <input value={values.search} name='search' className={`pl-2 w-full h-5 rounded-full ${mode.text} ${mode.subBackground} text-sm focus:outline-${mode.color} transition-colors duration-500 my-1`} placeholder='Search emojis' onChange={handleChange} onBlur={handleBlur}/>
            {emojis.length > 0 && <div className='w-auto h-[200px] flex-wrap overflow-y-auto overflow-x-hidden'> 
            {displayedEmojis.map( (emoji, index) => <i  key={index} className={`${hoverClass} cursor-pointer text-center`} onClick={() => insertEmoji(emoji.character)} >{emoji.character}</i>)}
        </div>}
        { loading && <p className='text-4xl'>LOADING</p>}
            </div>}
    </div>
  )
}

export default EmojiMenu
