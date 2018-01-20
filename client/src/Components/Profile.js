import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';

import './Profile.css';

class Profile extends Component {
 constructor(props) {
  super(props);
  this.state = {
   loggedIn: true
  };
 }

 // Facebook
 responseFb = response => {
  fetch('https://localhost:3001/auth/facebook', {
   method: 'POST',
   body: JSON.stringify(response),
   headers: new Headers({
    'Content-Type': 'application/json'
   })
  })
   .then(res => res.json())
   .then(data => {
    localStorage.setItem('userSearches', data.searches);
    localStorage.setItem('userShortcuts', data.shortcuts);
    localStorage.setItem('accessToken', data.accessToken);
    this.login();
   });
 };

 login = async () => {
  fetch('https://localhost:3001/login', {
   headers: {
    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
   }
  })
   .then(res => res.json())
   .then(data =>
    this.setState({
     user: data
    })
   );
 };

 renderProfile = open => {
  return open === true ? (
   <div className="profile_container">
    <div className="profile_img_div">
     <img className="profile_img" src="https://i.imgur.com/ycmx6tt.jpg" />
    </div>
    <div className="profile_name">Arol Vinolas</div>
    <div className="profile_email">arolvinolas@codeworks.me</div>
   </div>
  ) : (
   <div className="profile_container">
    <img
     className="profile_img"
     src="http://www.combonetwork.com/img/empty_profile.png"
    />

    <div className="profile_login_div">
     <div className="profile_login_text">Login with:</div>
     <FacebookLogin
      appId="180949189168618"
      autoLoad={true}
      fields="name,email,picture"
      scope="public_profile,user_friends,user_actions.books"
      callback={this.responseFb}
     />
    </div>
   </div>
  );
 };

 // RENDER =========================
 render() {
  return <div> {this.renderProfile(this.state.loggedIn)}</div>;
 }
}

export default Profile;