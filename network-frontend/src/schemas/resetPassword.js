import * as yup from 'yup';

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
//min 8 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit

export const ResetPasswordSchema = yup.object().shape({
    email : yup.string().email('Please enter a valid email.').required('This field is required.').test('email', 'Incorrect email.', async value => {
        const response = await fetch(`http://127.0.0.1:8000/emailExists/${value}`);
        const result = await response.json();
        return result.exists ? true : false;
    }),
    code : yup.string().required('This field is required.').test('code', 'Incorrect code', async (value, context) => {
        const email = context.parent.email;

        const response = await fetch(`http://127.0.0.1:8000/code/validate`, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({email, code : value, validate : false})
        });
        const result = await response.json();
        return result.validated ? true : false;
    }),
    password: yup.string().matches(passwordRules, {'message' : 'Please create a stronger password.'}).required('This field is required.'),
    confirmation: yup.string().oneOf([yup.ref('password'), null], 'Password does not match.').required('This field is required')
})