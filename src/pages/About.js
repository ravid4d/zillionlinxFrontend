import axios from 'axios';
import React from 'react'

const About = () => {
  let url = `${process.env.REACT_APP_API_URL}/api/google`;
const googleLogin = async() => {
    try {
        let response = await axios.get(url);
        console.log(response, 'this is response');
    } catch (error) {
        console.log(error, 'this is error');
    }
}
  return (
    <button className="btn dark-btn" onClick={googleLogin}>Login with google kartik G</button>
  )
}

export default About
