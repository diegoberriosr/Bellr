import { useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const FormattedContent = ({content}) => {
  const navigate = useNavigate()
  const ref = useRef();

  
  const formattedContent = content.replace(/\n/g, '<br>');

  const contentWithMentions = formattedContent.replace( /@[a-zA-Z0-9_]+/, match => {
    return `<span class='text-twitter-blue hover:opacity-80'>${match}</span>`
  })

  useEffect(() => {
    const mentions = ref.current.querySelectorAll('.text-twitter-blue');
    mentions.forEach(mention => {
      mention.addEventListener('click', () => {
        navigate(`/user/${mention.innerHTML.slice(1)}`);
      });
    });
  }, [content]);

  return (
        <p dangerouslySetInnerHTML={{__html: contentWithMentions}} className='w-full mt-[3px] overflow-hidden pr-5 whitespace-normal' ref={ref}/>
  )
}

export default FormattedContent
