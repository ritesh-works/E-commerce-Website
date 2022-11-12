import {API} from '../../backend'
//API means http://localhost:8000/api

export const signup = user => {
    return fetch(`${API}/signup`, { 
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

export const signin = user => {
    return fetch(`${API}/signin`, { 
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

/*ASYNC version
export const signin = async user => {
    try {
        const response = await fetch(`${API}/signin`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(user)
        })
        return await response.json()
    } catch (err) {
        return console.log(err)
    }
}
*/

//a token is set when user is signed in to user browser
export const authenticate = (data, next) => {
    if(typeof window !== 'undefined'){
        localStorage.setItem('jwt', JSON.stringify(data))
        next()
    }
}

//now in signout we are accessing above object and removing jwt
export const signout = next => {//'next' allow us to call a callback
    if(typeof window !== 'undefined'){
        localStorage.removeItem('jwt')
        next()
        return fetch(`${API}/signout`,{
            method: 'GET'
        })
        .then(() => console.log('Signout success'))//response can be taken
        .catch(err => console.log(err))
    }
}

export const isAuthenticated = () => {
    if( typeof window == 'undefined')//jwt is stored inside window object so accessing that
        return false
    if(localStorage.getItem('jwt'))
        return JSON.parse(localStorage.getItem('jwt'))//we are checking that is it he same token
    else
        return false
}