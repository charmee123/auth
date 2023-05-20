import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import avatar from '../assets/profile.png';
import styles from '../styles/login.css';
import toast,{Toaster} from 'react-hot-toast';
import { useFormik } from 'formik';
import {emailValidate} from '../helper/validate';
import { usernameValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store';
import { updateUser } from '../helper/helper';

export default function Profile() {

  const [file,setFile] = useState()
  const {email} = useAuthStore(state=>state.auth)
  const [{isLoading, apiData, serverError}] = useFetch(`/user/${email}`)

  const formik = useFormik({
    initialValues: {
      username: apiData?.username ||  '',
      email : apiData?.email || ''
      
    },
    enableReinitialize:true,
    validate: usernameValidation,
    validate: emailValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values =>{
      values = await Object.assign(values,{profile: file||apiData?.profile || ''})
      let updatedPromise = updateUser(values);

      // toast.promise(updatedPromise,{
      //   loading:"Updating",
      //   Success: <b>Updated Succesfully...</b>,
      //   error: <b>Could not update</b>
      // })
      console.log(values);
    }
  })

  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  if(isLoading) return <h2 className='alert-primary'>isLoading</h2>
  if(serverError) return <h2 className='alert-danger'>{serverError.message}</h2>

  return (
    
  <div className="container mt-5">
    <Toaster position='top-center' reverseOrder={false}></Toaster>
    <h1>User Profile</h1>

    <div className="row">
      <div className="col-sm-8">
        <div className="card">
          <div className="card-body">

            
            <form onSubmit={formik.handleSubmit}>

              <div className="profile">
                <label htmlFor="profile" className="profile-img rounded mx-auto d-block">
                  <img className="profile-img rounded mx-auto d-block" src={apiData?.profile || file||avatar} alt="avatar" />
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
                <label htmlFor="email">Email</label>
                <input {...formik.getFieldProps('email')} type="email" className="form-control" name="email"/>
              </div>
              


              {/* <button type="submit" className="btn btn-dark">Update</button> */}
              <hr />
              <span>See You Soon🙋🏻‍♂️<Link to='/' className='mx-3'>Logout</Link></span>
            </form>

          </div>
        </div>
      </div>

      

    </div>
  </div>


  )
}
