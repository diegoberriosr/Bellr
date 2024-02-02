import SleepingDog from '../sleepingdog.png';


const ErrorMessage = () => {
  return (
    <div className='w-full flex justify-center'>
        <div className='w-8/12 flex flex-col items-center justify-center bg-twitter-dark rounded-2xl py-2.5 mt-5'>
        <img src={SleepingDog} alt='sleeping puppy' width='200'/>
        <h3 className='mt-2 text-2xl text-extrabold'>No posts to show.</h3>
        </div>
    </div>

  )
}

export default ErrorMessage
