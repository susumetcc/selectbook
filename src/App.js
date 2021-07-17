import { Button } from '@material-ui/core';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
// import Signup from "./pages/Signup";
// import Signin from "./pages/Signin";
import './App.css';
import Header from './components/Header'
// import Auth from "./components/Authentication/Auth"
import Home from "./pages/Home";
// import Article from "./pages/Article";
import Timeline from "./pages/Timeline";
import Post from "./pages/Post";

// CSSスタイル
const theme = createTheme({
  typography: {
    button: {
      // 小文字が大文字に変換されるのをオフにする
      textTransform: "none"
    }
  }
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Header />
          {/* <Button color="secondary" href="/signup">新規登録</Button> */}
          {/* <Button color="secondary" href="/signin">サインイン</Button> */}
          {/* <Button color="secondary" href="/signout">サインアウト</Button> */}
        <Router>
          <Route exact path="/" component={Home}></Route>
          {/* <Route exact path="/signup" component={Signup}></Route> */}
          {/* <Route exact path="/signin" component={Signin}></Route> */}
          {/* <Route exact path="/p/:docid" component={Article}></Route> */}
          <Route exact path="/t/:userid" component={Timeline}></Route>
          {/* <Route exact path="/signout" component={Signout}></Route>
          {/* ここから下は認証が必要なページ */}
          <Route exact path="/post" component={Post}></Route>
          {/* <Route exact path="/post"><Auth path="/post" component={Post}></Auth></Route> */}
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
