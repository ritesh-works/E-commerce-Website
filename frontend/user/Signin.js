import React, {useState} from 'react'
import Base from '../core/Base'
import {Redirect} from 'react-router-dom'
import { signin, authenticate, isAuthenticated } from '../auth/helper'

const Signin = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    loading: false,
    didRedirect: false
  })

  const {email, password, error, loading, didRedirect} = values
  const {user} = isAuthenticated()

  const handleChange = name => event => {//higher order function, now we don't need to create different function for name,email,password...
    setValues({...values, error: false, [name]: event.target.value})//... loads all the values
  }

  const loadingMessage = () => {
    return(
      loading && (//if loading is true then after & part executes
        <div className='alert alert-info'>
          <h2>Loading...</h2>
        </div>
      )
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

  const onSubmit = event => {
    event.preventDefault()
    setValues({...values, error: false, loading: true})
    signin({email, password})
    .then(data => {
      if(data.error)
      setValues({...values, error: data.error, loading: false})
      else
      authenticate(data, () => {
      setValues({
        ...values,
        email: '',
        password: '',
        didRedirect: true
        })
    })})
    .catch(console.log('error in sign in') )
  }

  const performRedirect = () => {
    if (didRedirect){
      if(user && user.role === 1)
        return <p>redirect to admin</p>
      else
        return <p>redirect to user dashboard</p>
    }
    if(isAuthenticated())
      return <Redirect to='/'/>//TODO:not working
  }

    const signInForm = () => {
        return (
          <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
              <form>
                <div className="form-group">
                  <label className="text-light">Email</label>
                  <input onChange={handleChange("email")} className="form-control h-25" type="email" value={email}/>
                </div>
                <div className="form-group">
                  <label className="text-light">Password</label>
                  <input onChange={handleChange("password")} className="form-control h-25" type="password" value={password}/>
                </div>
                <button onClick={onSubmit} className="btn btn-success btn-block">Submit</button>
              </form>
            </div>
          </div>
        );
      };

    return(
        <Base title='SIGN IN' description='A page for user to sign in!'>
          {loadingMessage()}
          {errorMessage()}
            {signInForm()}
            {performRedirect()}
            <p className='text-white text-center'>{JSON.stringify(values)}</p>
        </Base>
    )
}

export default Signin