import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { auth } from '../../settings/firebase';
import LoadingOverlay from 'react-loading-overlay';

// 認証リダイレクトページ
class RedirectAuth extends React.Component {
  render() {
    return (
      <Redirect to={"/signin?redirect=" + encodeURIComponent(this.props.path)} />
    )
  }
}

// 認証情報の確認
class Auth extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      signinCheck: false, //ログインチェックが完了してるか
      signedIn: false, //ログインしてるか
    };
  }

  _isMounted = false; //unmountを判断

  componentDidMount = () => {
    //mountされてる
    this._isMounted = true;

    //ログインしてるかどうかチェック
    auth.onAuthStateChanged(user => {
      if (user) {
        //してる
        if (this._isMounted) {
          this.setState({
            signinCheck: true,
            signedIn: true,
          });
        }
      } else {
        //してない
        if (this._isMounted) {
          this.setState({
            signinCheck: true,
            signedIn: false,
          });
        }
      }
    })
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  }

  render() {
    //チェックが終わってないなら（認証が必要なURLの場合はローディング表示）
    if (!this.state.signinCheck && window.location.pathname.indexOf(this.props.path.replace(/:\S+?/g, '' )) === 0) {
      return (
        <LoadingOverlay
          active={true}
          spinner
          text='Loading...'
        >
          <div style={{ height: '100vh', width: '100vw' }}></div>
        </LoadingOverlay>
      );
    }

    //チェックが終わりかつ
    if (this.state.signedIn) {
      //サインインしてるとき（そのまま表示）
      console.log("ログイン中")
      return <Route exact path={this.props.path} component={this.props.component}></Route>;
    } else {
      //してないとき（ログイン画面にリダイレクト）
      return <Route exact path={this.props.path} render={({match}) => (
        <RedirectAuth path={this.props.path} match={match} />
      )}></Route>;
    }
  }
}

export default Auth;