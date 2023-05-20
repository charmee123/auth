import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate'
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store'
import { verifyPassword } from '../helper/helper'

import styles from '../styles/login.css';

export default function Password() {

  const navigate = useNavigate();
  const {email} = useAuthStore(state=>state.auth)
  const [{isLoading, apiData, serverError}] = useFetch(`/user/${email}`)

  const formik = useFormik({
    initialValues: {
      password: 'admin@123'
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values =>{
      // console.log(values);
      let loginPromise = verifyPassword({email,password:values.password})
      toast.promise(loginPromise,{
        loading:"Checking...",
        success: <b>Login successfully</b>,
        error: <b>Password Not match!</b>
      });
      // loginPromise.then(res=>{
      //   let {token} = res.data;
      //   localStorage.setItem('token',token)
      //   navigate('/profile');
      // })
      navigate('/profile');
    }
  })

  if(isLoading) return <h2 className='alert-primary'>isLoading</h2>
  if(serverError) return <h2 className='alert-danger'>{serverError.message}</h2>

  return (
    <div className="container mt-5">

    <Toaster position='top-center' reverseOrder={false}></Toaster>
      <h1>Login</h1>

      <div className="row">
        <div className="col-sm-8">
          <div className="card">
            <div className="card-body">

              <div className="form-group">
                <h4>Hello {apiData?.name || apiData?.email}</h4>
              </div>
              
              <form  onSubmit={formik.handleSubmit}>
                <div className="profile">
                  <img className="profile-img rounded mx-auto d-block" src={apiData?.profile || avatar} alt="avatar" />
                </div>
                
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" className="form-control" name="password"/>
                    <div>Forgot Password? <Link to="/recovery">Recover now</Link></div>
                </div>
                <button type="submit" className="btn btn-dark">Login</button>
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
