import React from 'react'
import "../styles.css"
import {API} from '../backend'
import Base from './Base'

//priority is given to prop passed from parent
export default function Home() {
    console.log('API IS', API)
  return (
    <Base title="Home Page" description='Welcome to the Tshirt Store'>
        <div className='row'>
        <div className='col-4'>
            <button className='btn btn-success'>TEST</button>
        </div>
        <div className='col-4'>
            <button className='btn btn-success'>TEST</button>
        </div>
        <div className='col-4'>
            <button className='btn btn-success'>TEST</button>
        </div>
        </div>
        </Base>
  )
}
