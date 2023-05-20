import React,{useState} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import styles from '../styles/login.css';
import toast,{Toaster} from 'react-hot-toast';
import { useFormik } from 'formik';
// import {emailValidate} from '../helper/validate';
// import { passwordValidate } from '../helper/validate';
// import { reg_noValidation } from '../helper/validate';
// import { usernameValidation } from '../helper/validate';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';


export default function Signup() {

  const navigate = useNavigate()

  const [file,setFile] = useState()

  const formik = useFormik({
    initialValues: {
      username: '',
      reg_no: '',
      password: '',
      email : ''
      
      
    },
    // validate: usernameValidation,
    // validate: emailValidate,
    // validate: passwordValidate,
    // validate: reg_noValidation,
    validate : registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      values = await Object.assign(values, { profile : file || ''})
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success : <b>Register Successfully...!</b>,
        error : <b>Could not Register.</b>
      });

      registerPromise.then(function(){ navigate('/')});
    }
  })

  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    
  <div className="container mt-5">
    <Toaster position='top-center' reverseOrder={false}></Toaster>
    <h1>Signup</h1>

    <div className="row">
      <div className="col-sm-8">
        <div className="card">
          <div className="card-body">

            
            <form onSubmit={formik.handleSubmit}>

              <div className="profile">
                <label htmlFor="profile" className="profile-img rounded mx-auto d-block">
                  Click on icon to upload your photo
                  <img className="profile-img rounded mx-auto d-block" src={file||avatar} alt="avatar" />
                </label>

                <input onChange={onUpload} type="file" name="profile" id="profile" />
                
              </div>
              <div className="form-group my-2">
                <div className="form-group">
                  <label htmlFor="username">Name</label>
                <input {...formik.getFieldProps('username')} type="text" className="form-control" name="username" required/>
                </div>
              </div>
              <div className="form-group ">
                <label htmlFor="Registration_no">Registration Number</label>
                <input {...formik.getFieldProps('reg_no')} type="text" className="form-control" name="reg_no" required/>
              </div>
              <div className="form-group ">
                <label htmlFor="email">Email</label>
                <input {...formik.getFieldProps('email')} type="email" className="form-control" name="email"/>
              </div>
              <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input {...formik.getFieldProps('password')} type="password" className="form-control" />
                  
              </div>
          
              <button type="submit" className="btn btn-dark">Signup</button>
              <hr />
              <span>Already Registered? <Link to='/'>Login</Link></span>
            </form>

          </div>
        </div>
      </div>

      <div className="col-sm-4">
        <div className="card social-block">
          <div className="card-body">
            <Link className="btn btn-block btn-social btn-google" to="/auth/google" role="button">
              <i className="fab fa-google"></i>
              Sign Up with Google
            </Link>
          </div>
        </div>
      </div>

    </div>
  </div>


  )
}
