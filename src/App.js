import { Button } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import Signup from "./pages/AuthPage/Signup";
import Signin from "./pages/AuthPage/Signin";
import Signout from './pages/AuthPage/Signout';
import './App.css';
import Header from './components/Header'
import Auth from "./components/Authentication/Auth"
import Home from "./pages/Home";
// import Article from "./pages/Article";
import Book from "./pages/Book";
import Post from "./pages/RequireAuth/Post";
import Settings from "./pages/RequireAuth/Settings";

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
        <Router>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/signup" component={Signup}></Route>
            <Route exact path="/signin" component={Signin}></Route>
            <Route exact path="/signout" component={Signout}></Route>
            {/* <Route exact path="/p/:docid" component={Article}></Route> */}
            {/* ここから下は認証が必要なページ */}
            <Route exact path="/post"><Auth path="/post" component={Post}></Auth></Route>
            <Route exact path="/settings"><Auth path="/settings" component={Settings}></Auth></Route>
            {/* どれにもマッチしなかったらユーザページを表示する */}
            <Route exact path="/:userid" component={Book}></Route>
          </Switch>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
