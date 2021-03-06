import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import serverHost from '../serverHost';
import { shortcutCode } from '../data/shortcutData';
import './Profile.css';
import empty_profile from '../images/profile_icon.png';
// import GoogleIcon from 'react-icons/lib/fa/google';
// import logout from '../assets/img/logout.png';


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (localStorage.getItem('accessToken')) {
      console.log('AC', localStorage.getItem('accessToken'));
      this.login();
    }
  }

 // Facebook
 responseFb = response => {
   fetch(`${serverHost}/auth/facebook`, {
     method: 'POST',
     body: JSON.stringify(response),
     headers: new Headers({
       'Content-Type': 'application/json'
     })
   })
     .then(res => res.json())
     .then(data => {
       localStorage.setItem('accessToken', data.accessToken);
       this.login();
     });
 };

 responseGoogle = response => {
   fetch(`${serverHost}/auth/google`, {
     method: 'POST',
     body: JSON.stringify(response),
     headers: new Headers({
       'Content-Type': 'application/json'
     })
   })
     .then(res => res.json())
     .then(data => {
       localStorage.setItem('accessToken', data.accessToken);
       this.login();
     });
 };

 updateLocalStorage = (data, userList) => {
   let localData = localStorage.getItem(userList).split(',');
   data.forEach(str => {
     localData.push(str);
   });
   let newData = localData.join(',');
   localStorage.setItem(userList, newData);
 };

 login = async () => {
   localStorage.setItem('userSearches', []);
   if (localStorage.getItem('accessToken')) {
     await this.props.logged(true);
     await fetch(`${serverHost}/login`, {
       headers: {
         Authorization: 'Bearer ' + localStorage.getItem('accessToken')
       }
     })
       .then(res => {if (res.status === 200) return res.json();})
       .then(data => {
         if (data) {
           this.props.setUserData(data);
           if (data.shortcutsList.length > 0)
             this.updateLocalStorage(data.shortcutsList, 'userShortcuts');
           if (data.searchesList.length > 0)
             this.updateLocalStorage(data.searchesList, 'userSearches');
         }
       });
   }
 };

 logout = () => {
   localStorage.removeItem('accessToken');
   localStorage.setItem('userShortcuts', shortcutCode);
   localStorage.setItem('userSearches', []);
   this.props.logout();
 };

 renderProfile = () => {
   return this.props.userData ? (
     <div className="profile_container">
       <img className="profile_img" src={this.props.userData.profile_picture} alt="profile Picture"/>
       <div className="profile_login profile_login--loggedIn">
         <div className="profile_name">{this.props.userData.name}</div>
         <div className="profile_email">{this.props.userData.email}</div>

         <div onClick={() => this.logout()} className="profile_logout">
           <span>log out</span>
         </div>
       </div>
     </div>
   ) : (
     <div className="profile_container">
       <img className="profile_img" src={empty_profile} alt="empty profile Picture" />
       <div className="profile_login">
         {/* <div className="profile_login_text">Login with:</div> */}
         <FacebookLogin
           cssClass="profile_login_button profile_login_button--facebook"
           appId="180949189168618"
           autoLoad={false}
           fields="name, email, picture.width(500).height(500)"
           callback={this.responseFb}
           textButton=""
           icon="fa-facebook"
         />
         {/* <GoogleLogin
      clientId="1089959983020-u8m1st89h7r4psfk2n4tdeq8ugkb7g62.apps.googleusercontent.com"
      buttonText="G+"
      className="profile_login_button profile_login_button--google"
      scope="profile email"
      onSuccess={this.responseGoogle}
      onFailure={this.responseGoogle}
     /> */}
       </div>
     </div>
   );
 };

 // RENDER =========================
 render() {
   return <div> {this.renderProfile()}</div>;
 }
}

export default Profile;
