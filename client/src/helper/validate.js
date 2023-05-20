import toast from 'react-hot-toast';
import  {authenticate} from './helper';

/** validate login page email */
export async function emailValidate(values){
    const errors = emailVerify({}, values);

    if(values.email){
        // check user exist or not
        const { status } = await authenticate(values.email);
        
        if(status !== 200){
            errors.exist = toast.error('User does not exist...!')
        }
    }

    return errors;
}

/** Validate register form */
export async function registerValidation(values){
    const errors = usernameVerify({}, values);
    reg_noVerify({},values);
    passwordVerify(errors, values);
    emailVerify(errors, values);

    return errors;
}

/** validate username */
export async function usernameValidation(values){
    const errors = usernameVerify({}, values);
    
    return errors;
}

/** Validate reg_no */
export async function reg_noValidation(values){
    const errors = reg_noVerify({}, values);
   
    return errors;
}

/** validate password */
export async function passwordValidate(values){
    const errors = passwordVerify({}, values);

    return errors;
}

/** validate Reset password */
export async function resetPasswordValidation(values){
    const errors = passwordVerify({}, values);

    if(values.password !== values.confirm_pwd){
        errors.exist = toast.error("Password not match...!");
    }

    return errors;
}

/** validate profile page */
export async function profileValidation(values){
    const errors = emailVerify({}, values);
    return errors;
}

/** ################################################## */

/** validate username */
function usernameVerify(error = {}, values){
    if(!values.username){
        error.username = toast.error('username Required...!');
    }else if(values.username.includes(" ")){
        error.username = toast.error('Invalid username...!')
    }

    return error;
}

/** validate Registration number */
function reg_noVerify(error = {}, values){
    if(!values.reg_no){
        error.reg_no = toast.error('Registration Number Required...!');
    }else if(values.reg_no.includes(" ")){
        error.reg_no = toast.error('Invalid Registration Number...!')
    }

    return error;
}

/** validate email */

function emailVerify(error ={}, values){
    if(!values.email){
        error.email = toast.error("Email Required...!");
    }else if(values.email.includes(" ")){
        error.email = toast.error("Wrong Email...!")
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email = toast.error("Invalid email address...!")
    }

    return error;
}

/** validate password */
function passwordVerify(errors = {}, values){
    /* eslint-disable no-useless-escape */
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if(!values.password){
        errors.password = toast.error("Password Required...!");
    } else if(values.password.includes(" ")){
        errors.password = toast.error("Wrong Password...!");
    }else if(values.password.length < 4){
        errors.password = toast.error("Password must be more than 4 characters long");
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error("Password must have special character");
    }

    return errors;
}

