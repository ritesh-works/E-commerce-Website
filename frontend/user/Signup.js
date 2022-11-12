import React, {useState} from 'react'
import Base from '../core/Base'
import { signup } from '../auth/helper';
import {Link} from 'react-router-dom'

const Signup = () => {
    const [values, setValues] = useState({
      name: '',
      email: '',
      password: '',
      error: '',
      success: false
    })
    
    const {name, email, password, success, error} = values

    const handleChange = name => event => {//higher order function, now we don't need to create different function for name,email,password...
      setValues({...values, error: false, [name]: event.target.value})//... loads all the values
    }

    const onSubmit = event => {
      event.preventDefault()//it prevents default action that happens when we click submit button
      setValues({...values, error: false})
      signup({name, email, password})
      .then(data => {
        if(data.error)
        setValues({...values, error: data.error, success: false})
        else
        setValues({...values,
          name: '',
          email: '',
          password: '',
          error: '',
          success: true})
      })
      .catch(console.log('error in sign up') )
    }

    const successMessage = () => {
      return(
        <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
      <div className='alert alert-success' style={{display: success ? '' : 'none'}}>
        New account was created successfully. Please <Link to='/signin'>Login here</Link>
      </div>
      </div></div>
      )
    }

    const errorMessage = () => {
      return(
        <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
      <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
        {error}
      </div>
      </div>
      </div>
      )
    }

    const signUpForm = () => {
      return (
        <div className="row">
          <div className="col-md-6 offset-sm-3 text-left">
            <form>
              <div className="form-group">
                <label className="text-light">Name</label>
                <input className="form-control h-25" onChange={handleChange('name')} type="text" value={name} />
              </div>
              <div className="form-group">
                <label className="text-light">Email</label>
                <input className="form-control h-25" onChange={handleChange('email')} type="email" value={email}/>
              </div>
  
              <div className="form-group">
                <label className="text-light">Password</label>
                <input className="form-control h-25" onChange={handleChange('password')} type="password" value={password}/>
              </div>
              <button className="btn btn-success btn-block " onClick = {onSubmit}>Submit</button>
            </form>
          </div>
        </div>
      );
    };
    return (
      <Base title="SIGN UP" description="A page for user to sign up!">
        {successMessage()}
        {errorMessage()}
        {signUpForm()}
        <p className='text-white text-center'>{JSON.stringify(values)}</p>
      </Base>
    );
  };

export default Signup