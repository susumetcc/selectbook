import React from "react";
import { Link, Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import firebase, { auth, db } from '../../settings/firebase';
import AuthForm from "../../components/Authentication/AuthForm";
import LoginProvider, { SignupLoginHandler } from "../../components/Authentication/LoginProvider";
import "./Signup.css";
import getQueryStrings from "../../utils/getQueryStrings";

// アカウントの開設画面
class Signup extends React.Component {
  constructor(props) {
    super(props);
    const query = window.location.search;
    // 遷移元ページ
    let redirect = "/";
    if(props.redirect) {
      redirect = props.redirect;
    } else if(query) {
      redirect = getQueryStrings(query)['redirect'];
    }
    this.state = {email: '', password: '', name: '', isSignin: false, isChecking: false, redirect: decodeURIComponent(redirect)};

    this.mailChange = this.mailChange.bind(this);
    this.passChange = this.passChange.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.googleLoginHandler = this.googleLoginHandler.bind(this);
  }

  mailChange(event) {
    this.setState({email: event.target.value});
  }

  passChange(event) {
    this.setState({password: event.target.value});
  }

  nameChange(event) {
    this.setState({name: event.target.value});
  }

  // アカウントの開設
  handleSubmit(event) {
    event.preventDefault();
    // alert('A name was submitted: ' + this.state.email);
    // Sign Up
    auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(async (userCredential) => {
      // Signed in
      var user = userCredential.user;
      const displayid = user.uid
      await db.collection("users").doc(user.uid).set({
        pageUrl: "",
        name: this.state.name,
        displayid: displayid,
        avatarUrl: "",
        intro: "",
        favorite: [],
        follow: [],
        follower: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      await db.collection("displayids").doc(displayid).set({
        uid: user.uid,
      });
      this.setState({isSignin: true});
    })
    .catch((error) => {
      console.log(error);
    });
  }

  /* サードパーティ製プロバイダによる認証 */
  // Google認証
  async googleLoginHandler() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.setState({isChecking: true});
    await auth.signInWithPopup(provider).then(async (result) => {
      console.log("認証成功: " + result.user.uid);
      SignupLoginHandler(result.user);
      this.setState({isSignin: true});
    }).catch((error) => {
      console.log(error)
      this.setState({open: true, isChecking: false});
    });
  }

  render() {
    return (
      <Grid container justifyContent="center">
        { this.state.isSignin === true ?
          <Redirect to={this.state.redirect} />
        :
          <Grid item maxwidth="xs">
            <div>
              <React.Fragment>
                <span className={"center-item"}>
                  <span className={"avatar-area"}>
                    <PersonAddIcon
                      style={{ height: "32px", width: "32px", color: "#ffffff" }}
                    />
                  </span>
                </span>
                <Typography className={"center-item"} component="h1" variant="h5">
                  Sign Up
                </Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="name"
                  label="表示名"
                  id="name"
                  onChange={this.nameChange}
                />
                <AuthForm
                  handleSubmit={this.handleSubmit}
                  onChangeMail={this.mailChange}
                  onChangePass={this.passChange}
                  type={"サインアップは無料です"}
                />
                <div>
                  {this.state.isChecking?
                    <p>認証中...</p>
                  :
                    <LoginProvider
                      google={this.googleLoginHandler}
                    />
                  }
                </div>
                <p>
                  すでにアカウントをお持ちの方は
                  <Link to={this.state.redirect === "/" ? "/signin" : "/signin?redirect=" + encodeURIComponent(this.state.redirect)}>
                    こちらからサインイン
                  </Link>
                </p>
              </React.Fragment>
            </div>
          </Grid>
        }
      </Grid>
    );
  }
}

export default Signup;