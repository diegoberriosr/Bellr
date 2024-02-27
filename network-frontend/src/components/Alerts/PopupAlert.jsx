import { useNavigate } from 'react-router-dom';

const PopupAlert = ({ children, containerStyle, downwards, redirectLink}) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (redirectLink) {
        navigate(redirectLink);
        return;
    }
    return null;
  }

  return (
    <div onClick={handleRedirect} className={`flex items-center justify-center ${containerStyle} ${downwards ? 'animate-alert-downwards' : 'animate-alert-upwards'}`}>
      {children}
    </div>
  )
}

export default PopupAlert
