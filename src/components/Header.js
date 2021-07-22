import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from "@material-ui/icons/AccountCircle";
import { auth, db } from "../settings/firebase";
import AuthCheck from "../components/Authentication/Check";
import getQueryStrings from "../utils/getQueryStrings";

// CSSスタイル
const barStyle = makeStyles(() => ({
  AppHeader: {
    position: "static",
    width: "calc(100vw - 17px)",
    height: "64px",
    display: "flex",
    /* main_color */
    background: "rgba(254, 253, 248, 0.94)"
  },
  AppToolbar: {
    height: "100%",
    alignItems: "center",
    paddig: "0px",
  },
  /* SelectBook */
  Apptitle: {
    height: "64px",
    alignItems: "center",
    // フォント
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "900",
    fontSize: "32px",
    lineHeight: "216%",
    /* identical to box height, or 64px */
    color: "#35322C"
  },
  barGrow: {
    flexGrow: "1"
  },
  barSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  /* barIcon */
  barIcon: {
    width: "44px",
    height: "44px",
    marginRight: "7px",
  },
  /* Icon */
  iconCircle: {
    width: "32px",
    height: "32px",
    color: "#555046",
  },
  accountCircle: {
    width: "44px",
    height: "44px",
    alignItems: "center",
    justifyContent: "center",
  },
  AppSignup: {
    height: "44px",
    alignItems: "center",
    // フォント
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "18px",
    lineHeight: "250%",
    /* identical to box height, or 64px */
    color: "#555046"
  },
  AppPost: {
    width: "116px",
    height: "44px",
    marginLeft: "7px",
    /* post_Icon_color */
    background: "#E6CF7E",
    borderRadius: "13px",
    /* 投稿する テキスト*/
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",

    /*フォントはboldで違和感がなければ特に指定はしません*/
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "18px",
    lineHeight: "176.69%",
    /* identical to box height, or 32px */
    color: "#FFFFFF",
    /* ホバー時 */
    "&:hover": {
      background: "#C2AF6B"
    },
  }
}));

class UserAccountCircle extends React.Component {
  constructor(props){
    super(props);
    this.state = { name: "", avatarUrl: "" };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  _isMounted = false;

  componentDidMount() {
    const user = auth.currentUser;
    if (user !== null) {
      this.setState({name: user.displayName, avatarUrl: user.photoURL});
    }
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if(this.state.avatarUrl !== "") {
      return (
        <Avatar alt={this.state.name} src={this.state.avatarUrl} style={{height:"40px", width:"40px"}} />
      )
    } else {
      return (
        <AccountCircle style={{height:"40px", width:"40px", color:"#555046"}}/>
      )
    }
  }
}

// 現在のパスをパラメタにセットする
function nowlocation() {
  const redirect = getQueryStrings(window.location.search)["redirect"];
  if (redirect && redirect !== "/") {
    return "?redirect=" + encodeURIComponent(redirect);
  } else if (["/", "/signin", "/signup", "/signout"].indexOf(window.location.pathname) === -1) {
    return "?redirect=" + encodeURIComponent(window.location.pathname);
  }
  return "";
}

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleAccountMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDisplayUserPage = async () => {
    setAnchorEl(null);
    const user = auth.currentUser;
    if (user !== null) {
      db.collection("users").doc(user.uid).get().then(doc => {
        window.location.href = "/" + doc.data().displayid;
      }).catch(error => {
        return;
      })
    } else {
      return;
    }
  };

  const renderAccountMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="accountMenu"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      disableScrollLock={ true }
      open={isMenuOpen}
      onClose={handleAccountMenuClose}
    >
      <MenuItem onClick={handleDisplayUserPage}>マイディスプレイ</MenuItem>
      <MenuItem component="a" href="/settings" onClick={handleAccountMenuClose}>アカウント設定</MenuItem>
      <MenuItem component="a" href={"/signout" + nowlocation()} onClick={handleAccountMenuClose}>ログアウト</MenuItem>
    </Menu>
  );

  const classes = barStyle();
  return (
    <>
      <AppBar className={classes.AppHeader}>
        <Toolbar className={classes.AppToolbar}>
          <Button className={classes.Apptitle} href="/">
            <Typography className={classes.Apptitle} variant="h1" noWrap>Select Book</Typography>
          </Button>
          <div className={classes.barGrow} />
          <AuthCheck>
            <div className={classes.barSection}>
              <IconButton
                className={classes.barIcon}
                aria-label="show new notifications"
              >
                <Badge badgeContent={0} color="secondary">
                  <NotificationsIcon className={classes.iconCircle} />
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                className={classes.barIcon}
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleAccountMenuOpen}
              >
                <UserAccountCircle className={classes.accountCircle} />
              </IconButton>
              <Button className={classes.AppPost} href="/post">
                投稿する
              </Button>
              {renderAccountMenu}
            </div>
          </AuthCheck>
          <AuthCheck signout>
            <div className={classes.barSection}>
              <Button href={"/signin" + nowlocation()}>
                <Typography className={classes.AppSignup} variant="h1" noWrap>ログイン</Typography>
              </Button>
              <Button className={classes.AppPost} href={"/signup" + nowlocation()}>
                会員登録
              </Button>
            </div>
          </AuthCheck>
        </Toolbar>
      </AppBar>
    </>
  );
}
