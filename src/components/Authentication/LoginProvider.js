import React from "react";
import firebase, { auth, db } from '../../settings/firebase';

// Google認証
export async function SignupLoginHandler(user) {
  db.collection("users").doc(user.uid).get().then(async doc => {
    if (!doc.exists) {
      await db.collection("users").doc(user.uid).set({
        pageUrl: "",
        name: user.displayName,
        displayid: user.uid,
        avatarUrl: user.photoURL,
        intro: "",
        favorite: [],
        follow: [],
        follower: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      await db.collection("displayids").doc(user.uid).set({
        uid: user.uid,
      });
    }
  })
}

// プロバイダー経由サインインボタン
function ProviderSigninText(props) {
  const { onClick, children } = props;
  return (
    <div className={"providerSigninBtn"} onClick={onClick}>
      {children}
    </div>
  )
};
  
export default class LoginProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {google: props.google}
  }

  render() {
    return (
      <>
        <ProviderSigninText className={"login-google-btn"} onClick={this.state.google}>Googleでログイン</ProviderSigninText>
        {/* <ProviderSigninText className={"login-apple-btn"} onClick={this.appleLoginHandler}>Appleでログイン</ProviderSigninText> */}
      </>
    )
  }
}