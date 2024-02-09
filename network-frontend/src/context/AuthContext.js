import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {
    

    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const loginUser = async(values, setErrorMessage, setLoading) => {
        setLoading(true);
        fetch('http://127.0.0.1:8000/token/', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username' : values.username, 'password' : values.password})
        })
        .then(async response => {

            if (response.status === 200){
                const data = await response.json();
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));
                setLoading(false);
                navigate('/home');
            }
            else {
                setErrorMessage('Invalid credentials, please check your username/password.');
            }
        })
        .catch(error => {
            console.log(error);
            setErrorMessage('An error occurred, please try again.');
        });
    }
    

    const registerUser = (body, setErrorMessage, setLoading) => {
        console.log('BODY' , body);
        fetch('http://127.0.0.1:8000/register', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then( () => {
            console.log('register successful, redirecting');
            console.log(body.username, body.password);
            fetch('http://127.0.0.1:8000/token/', {
                method : 'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({'username' : body.username, 'password' : body.password})

            })
            .then( async response => {
                if (response.status === 200){
                    const data = await response.json();
                    setAuthTokens(data);
                    setUser(jwtDecode(data.access));
                    localStorage.setItem('authTokens', JSON.stringify(data));
                    navigate('/home')
                }
                else {
                    console.log(response);
                }
            }
            )
            .catch((error) => console.log(error));

        }
        )
        .catch(() => console.log('something went wrong with register'))
    }

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/home');
    }


    const updateToken = async () => {
        
        fetch('http://127.0.0.1:8000/token/refresh/', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'refresh' : authTokens.refresh})
        })
        .then(async response => {
            if (response.status === 200) {
                const data = await response.json();
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));

            }
            else{
                logoutUser();
            }
        })
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        registerUser:registerUser,
        logoutUser:logoutUser
    }

    useEffect(() => {
        const fourMinutes = 1000 * 60 * 4;
        const interval = setInterval(() => {
            if (authTokens) {
                console.log('refreshing');
                updateToken();
            }
        }, fourMinutes);

        return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}