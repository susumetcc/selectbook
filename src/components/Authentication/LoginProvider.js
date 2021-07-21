import React from "react";

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
    this.state = {google: props.google, apple: props.apple};
  }

  render() {
    return (
      <>
        <ProviderSigninText className={"login-google-btn"} onClick={this.state.google}>Googleでログイン</ProviderSigninText>
        {/* <ProviderSigninText className={"login-apple-btn"} onClick={this.state.apple}>Appleでログイン</ProviderSigninText> */}
      </>
    )
  }
}