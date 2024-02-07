import { FaPlus } from "react-icons/fa";
import { FaFeather } from "react-icons/fa";

const PostButton = ({ handleClick }) => {
    return (
        <button className='relative flex items-center justify-center min-w-[55px] min-h-[55px] w-11/12 p-2.5 rounded-full sm:rounded-3xl bg-twitter-blue hover:bg-opacity-85 text-white text-lg font-bold' onClick={handleClick}>
            <span className='absolute invisible xl:visible'>Post</span>
            <div className='absolute visible xl:invisible'>
                <FaFeather />
                <FaPlus className='absolute -top-2 -left-2 text-xs' />
            </div>
        </button>
    )
}

export default PostButton
