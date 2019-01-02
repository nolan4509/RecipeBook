import React, {
    Component
} from 'react';
import './login.css';
import firebase from '../firebase.js';
import NavBar from '../Components/NavBar/NavBar';
import RecipesPage from './RecipesPage';
require('firebase/auth');

class Login extends Component {
    constructor(props) {
        super(props)
        this.handleChangeEmail = this.handleChangeEmail.bind(this)
        this.handleChangeName = this.handleChangeName.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.handleChangeRememberMe = this.handleChangeRememberMe.bind(this)
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            realUserID: '',
            userID: '',
            userName: '',
            userEmail: '',
            userPassword: '',
            userRecipes: [],
            user: null,
            submissionStatus: '',
            rememberMe: true
        }
    }
    /*
    call the 'signOut' method on auth, and then using the Promise API
    we remove the user from our application's state. With 'this.state.user'
    now equal to null, the user will see the Log In button instead of the Log Out button.
    */
    logout() {
        firebase.auth().signOut().then(() => {
            sessionStorage.removeItem("uid");
            this.setState({
                user: null
            });
        });

        this.props.history.push('/')
    }

    /*
    Here call the 'signInWithPopup' method from the auth module,
    and pass in our 'provider' Now when you click the 'login'
    button, it will trigger a popup that gives up the option to
    sign in with a google account

    'signInWithPopup' has a promise API that allows us to call '.then' on it and pass in a callback.
    This callback will be provided with a 'result' object that contains, among other things, a
    property called '.user' that has all the information about the user who just signed in, we then
    store this inside of the state using 'setState'
    */
    login() {
        firebase.auth().signInWithEmailAndPassword(this.state.userEmail, this.state.userPassword).then((result) => {
            const user = result.user;
            this.setState({
                user
            });
            console.log(user);
            console.log(this.state.user);
            console.log("logged in as id: " + firebase.auth().currentUser.uid);
            this.setState({
                realUserID: firebase.auth().currentUser.uid
            })
            var uid = firebase.auth().currentUser.uid;
            //      this.props.history.push('/Home');
        }).then(uid => {
            sessionStorage.setItem("uid", this.state.realUserID);
            if (this.state.rememberMe) {
                localStorage.setItem("uid", this.state.realUserID);
                localStorage.setItem("expires", this.dateInOneWeek());
            }
        });
        /*
        .catch(function(error) {
                console.log(error.code);
                console.log(error.message);
            }
              auth.signInWithPopup(provider).then((result) => {
                  const user = result.user;
                  this.setState({
                      user
                  });
                  this.props.history.push('/Home')
              });
              */
    };

    handleChangeEmail(event) {
        this.setState({
            userEmail: event.target.value,
            userID: event.target.value.substr(0, event.target.value.indexOf('@'))
        })
    }

    handleChangePassword(event) {
        this.setState({
            userPassword: event.target.value
        })
    }

    handleChangeName(event) {
        this.setState({
            userName: event.target.value
        })
    }

    handleChangeRememberMe(event) {
        this.setState({
            rememberMe: event.target.value
        })
        console.log(this.state.rememberMe);
    }

    dateInOneWeek() {
        //the large number is how many milliseconds are in a week
        var newDate = new Date(Date.setTime(Date.getTime() + 604800000));
        return newDate;
    }

    componentDidMount() {
        // console.log(firebase.auth().currentUser.uid);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user
                }); // When user signs in, checks the firebase database to see
                // if they were already previously authenticated, if so, restore
            }
        });
    }

    render() {
        return (<div>
            <div>
                <NavBar/>
                {
                    this.state.user
                        ? <div className="backgroundStyle">
                                <RecipesPage history={this.props.history} currentUserID={firebase.auth().currentUser.uid}/>
                                <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={this.logout}>Log Out</button>
                            </div>
                        : <div>
                            {/* <NavBar/> */}
                        <div className="backgroundStyle">
                            <div className="container">
                                <form className="box">
                                    <h2 className="big">Please Login</h2>
                                    <div className="inputBox">
                                        <label htmlFor="inputEmail" className="sr-only inputBox">Email address</label>
                                        <input type="email" id="inputEmail" placeholder="Email address" required="required" autoFocus="autofocus" value={this.state.userEmail} onChange={this.handleChangeEmail}/>
                                    </div>
                                    <div className="inputBox">
                                        <label htmlFor="inputPassword" className="sr-only">Password</label>
                                        <input type="password" id="inputPassword" placeholder="Password" required="required" value={this.state.userPassword} onChange={this.handleChangePassword}/>
                                    </div>
                                    <div className="checkbox">
                                        <label>
                                            <input type="checkbox" ref="rememberMe" id="rememberMeField" name="rememberMeField" value={this.state.rememberMe} onChange={this.handleChangeRememberMe}/>
                                        </label>
                                    </div>
                                    <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={this.login}>Log In</button>
                                </form>
                            </div>
                                {/* Add another form here, consisting of just a button(?) that onClick -> googleLogin, and make 'login' for user&password */}
                            </div>
                        </div>
                }</div>
        </div>);
    }
}

export default Login;