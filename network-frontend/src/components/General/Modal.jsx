const Modal = ( {children, isVisible, background}) => {
    if (!isVisible) return null;
    return <div className={`fixed inset-0 ${background} bg-opacity-50 backdrop-blur-sm z-50 w-screen h-screen flex justify-center items-start`}>
                {children}
    </div>
};

export default Modal;