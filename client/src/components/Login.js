import React,{useEffect} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import styles from '../styles/login.css';
import {Toaster} from 'react-hot-toast';
import { useFormik } from 'formik';
import { emailValidate } from '../helper/validate';
import {useAuthStore} from '../store/store';

export default function Login() {

  const navigate = useNavigate();
  const setEmail = useAuthStore(state=>state.setEmail);
  

 
  const formik = useFormik({
    initialValues: {
      email : 'example@gmail.com',
    },
    validate: emailValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values =>{
      setEmail(values.email);
      // console.log(values);
      navigate('/password');
    }
  })

  return (
    <div className="container mt-5">

    <Toaster position='top-center' reverseOrder={false}></Toaster>
      <h1>Hey There!</h1>

      <div className="row">
        <div className="col-sm-8">
          <div className="card">
            <div className="card-body">

              
              <form  onSubmit={formik.handleSubmit}>
                <div className="profile">
                  <img className="profile-img rounded mx-auto d-block" src={avatar} alt="avatar" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input {...formik.getFieldProps('email')} type="email"  className="form-control" name="email"/>
                </div>
                
                <button type="submit" className="btn btn-dark">Let's go</button>
                <p className="mx-2 my-2">New User?  <a href="/signup">Signup here</a></p>
              </form>

            </div>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              <Link className="btn btn-block btn-social btn-google" to="/auth/google" role="button">
                <i className="fab fa-google"></i>
                Sign In with Google
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
