
const ErrorMessage = ({ text, subtext}) => {
  return (
    <div className='mt-2.5 w-full flex flex-col items-center justify-center'>
           <h3 className='text-2xl font-extrabold'>{text}</h3>
            <p className='text-gray-600'>{subtext}</p>
    </div>

  )
}

export default ErrorMessage
