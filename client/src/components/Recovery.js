import React from 'react';
import { Link } from 'react-router-dom';
import {Toaster} from 'react-hot-toast';

export default function Recovery() {


  return (
    <div className="container mt-5">

    <Toaster position='top-center' reverseOrder={false}></Toaster>
      <h1>Recover Your Password</h1>

      <div className="row">
        <div className="col-sm-8">
          <div className="card">
            <div className="card-body">

              
              <form >
                
                <div className="form-group">
                  <h4>Recovery</h4>
                  <span>Enter OTP to recover your password</span>
                </div>
                <div className='form-group'>
                  <span>Enter 6 digits OTP sent to your email address</span>
                </div>
                <div className="form-group">
                  <label htmlFor="OTP">OTP</label>
                  <input  type="text" className="form-control" placeholder="OTP"/>
                  
                </div>
                <button type="submit" className="btn btn-dark">Recover</button>
                <p className="mx-2 my-2">Can't get OTP?  <button className='btn btn-danger btn-sm' >Resend</button></p>
              </form>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
