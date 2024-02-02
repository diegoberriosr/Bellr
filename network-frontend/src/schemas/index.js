import * as yup from 'yup';

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
//min 8 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit

export const RegisterSchema = yup.object().shape({
    username : yup.string().max(15, 'Must be less or equal than 15 characters').required('This field is required').test('username', 'Username already exists', async value => {
        const response = await fetch(`http://127.0.0.1:8000/usernameExists/${value}`);
        const result = await response.json();
        return result.exists ? false : true;
    }),
    email : yup.string().email("Please enter a valid email").required('This field is required').test('email', 'Email already exists', async value => {
        const response = await fetch(`http://127.0.0.1:8000/emailExists/${value}`);
        const result = await response.json();
        return result.exists ? false : true;
    }),
    password : yup.string().min(8).matches(passwordRules, {'message' : "Please create a stronger password"}).required('This field is required'),
    confirmPassword : yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('This field is required'),
    profilename : yup.string().min(1, 'Must be at least 1 character long').max(50, 'Must be less or equal than 15 characters').required('This field is required'),
    bio : yup.string().max(160, 'Must be less or equal than 160 characters'),
    pfp : yup.string()
})