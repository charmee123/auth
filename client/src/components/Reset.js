import React from 'react';
import {Toaster} from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPasswordValidation } from '../helper/validate';

export default function Reset() {

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd: ''
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values =>{
      console.log(values);
    }
  })

  return (
    <div className="container mt-5">

    <Toaster position='top-center' reverseOrder={false}></Toaster>
      <h1>Reset Password</h1>

      <div className="row">
        <div className="col-sm-8">
          <div className="card">
            <div className="card-body">

              
              <form  onSubmit={formik.handleSubmit}>
                <div className="form-group">
                  <h4>Enter new password</h4>
                  <label htmlFor="password">New Password</label>
                  <input {...formik.getFieldProps('password')} type="password" className="form-control" placeholder='New Password' />
                </div>

                <div className="form-group">
                    <label htmlFor="confirm_pwd">Confirm Password</label>
                    <input {...formik.getFieldProps('confirm_pwd')} type="password" className="form-control" placeholder='Confirm Password' />
                </div>
      
                <button type="submit" className="btn btn-dark">Reset</button>
                
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
