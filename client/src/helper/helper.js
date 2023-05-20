import axios from 'axios';
import jwt_decode from 'jwt-decode';
axios.defaults.baseURL= process.env.REACT_APP_SERVER_DOMAIN;

/** API request */

/** Get email from token */
// export async function getEmail(){
//     const token = localStorage.getItem('token')
//     if(!token) return Promise.reject("Cannot find Token");
//     let decode = jwt_decode(token)
//     console.log(decode);
//     // return decode;
// }

/** authentication function */
export async function authenticate(email){
    try {
        return await axios.post('/api/authenticate',{email})
    } catch (error) {
        return {error:"Email doesn't exist"}
    }
}

//Get user details
export  async function getUser({email}){
    try {
       const {data} = await axios.get(`/api/user/${email}`)
    } catch (error) {
        return {error:"Password doesn't match...!"}
    }
}

//register user
export async function registerUser(credentials){
    try {
        const {data:{msg},status} = await axios.post(`/api/signup`,credentials)

        let {username,reg_no,email} = credentials;

        //send mail
        if (status===201){
            await axios.post('/api/registerMail', {username,reg_no,userEmail:email, text:msg})
        }

        return Promise.resolve(msg)

    } catch (error) {
       return Promise.reject({error}) ;
    }
}

//Login
export async function verifyPassword({email,password}){
    try {
      if(email){
        const data = await axios.post('/api/login',{email,password});
        return Promise.resolve({data});
      }  
    } catch (error) {
        return Promise.reject({error:"Password doesn't match"})
    }
}

//update 
export async function updateUser(response){
    try {
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser',response,{headers:{"Authorization":`Bearer ${token}`}})

        return Promise.resolve({data})
    } catch (error) {
        return Promise.reject({error: "Couldn't update Profile...!"})
    }
} 

/** generate otp */
export async function generateOTP(email){
    try {
       const {data:{code},status} = await axios.get('/api/generateOTP',{params:{email}})

       if(status === 201){
        let {data:{email}} = await getUser({email})
        let text = `Your Password OTP is ${code}. Verify and recover your password.`
        await axios.post('/api/registerMail',{userEmail:email,text, subject:"Password recovery OTP"})
       }
       return Promise.resolve(code);

    } catch (error) {
        return Promise.reject({error});
    }
}

//verify OTP
export async function verifyOTP({email,code}){
    try {
       const {data, status}= await axios.get('/api/verifyOTP',{params:{email,code}})
       return {data,status};
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function resetPassword({email,password}){
    try {
        const {data, status} = await axios.put('/api/resetPassword',{email,password});
        return Promise.resolve({data,status});
    } catch (error) {
        return Promise.reject({error})
    }
}