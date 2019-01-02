import React, {
    Component
} from 'react';
import firebase from '../firebase.js';
import './styles.css';
import NavBar from '../Components/NavBar/NavBar';

class newUser extends Component {
    constructor(props) {
        super(props)
        this.handleChangeEmail = this.handleChangeEmail.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.handleChangeUsername = this.handleChangeUsername.bind(this)
        this.state = {
            email: '',
            password: '',
            username: ''
        }
    }

    handleChangeEmail(event) {
        this.setState({
            email: event.target.value
        })
    }

    handleChangePassword(event) {
        this.setState({
            password: event.target.value
        })
    }

    handleChangeUsername(event) {
        this.setState({
            username: event.target.value
        })
    }

    createUser = (e) => {
        e.preventDefault();
        console.log(this.state.email);
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((UserCredential) => {
            console.log('user data (UserCredential.uid): ' + UserCredential.uid);
            fetch(`/add/user/${this.state.username}/${UserCredential.uid}/${this.state.email}`, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                }
            }).catch((error) => {
                console.log('Error inside newUser.js POST: ' + error);
            });
        }).catch(function(error) {
            console.log(error.code);
            console.log(error.message);
        });
        //    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
        this.props.history.push('/');
    };

    render() {
        return (
            <div className="backgroundStyle">
                <NavBar/>
                <h3> New User </h3>
                <form id = "newUserForm" onSubmit = {this.createUser}>
                    <div>
                        <label>User Email</label><br/>
                        <input type="text" name="userEmailField" value={this.state.email} onChange={this.handleChangeEmail}/>
                    </div>
                    <div>
                        <label>Password</label> <br/>
                        <input type="text" name="userPasswordField" value={this.state.password} onChange={this.handleChangePassword}/>
                    </div>
                    <div>
                        <label>Username</label> <br/>
                        <input type="text" name="userNameField" value={this.state.username} onChange={this.handleChangeUsername}/>
                    </div>
                    <br/>
                        <button id="newUserButton" form="newUserForm" type="submit">Submit</button>
                    <br/>
                </form>
            </div>
        );
    }
}

export default newUser;