const Modal = ( {children, isVisible, background}) => {
    if (!isVisible) return null;

    
    return <div className={`fixed inset-0 ${background} bg-opacity-50 backdrop-blur-sm flex justify-center z-50`}>
       <div className='mt-0 w-full h-full sm:w-[600px] flex flex-col sm:mt-2'>
            <div className='p-2 rounded'>
                {children}
            </div>
       </div>
    </div>
};

export default Modal;