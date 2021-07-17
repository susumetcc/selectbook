import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import AccountCircle from "@material-ui/icons/AccountCircle";

const barStyle = makeStyles(() => ({
  AppHeader: {
    position: "static",
    width: "100vw",
    height: "64px",
    display: "flex",
    /* main_color */
    background: "rgba(254, 253, 248, 0.94)"
  },
  AppToolbar: {
    height: "100%",
    alignItems: "center"
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
    justifyContent: "flex-end"
  },
  /* barIcon */
  barIcon: {
    width: "44px",
    height: "44px",
    marginRight: "7px"
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
    color: "#555046",
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

export default function Header() {
  const classes = barStyle();
  return (
    <>
      <AppBar className={classes.AppHeader}>
        <Toolbar className={classes.AppToolbar}>
          <Button className={classes.Apptitle} href="/">
            <Typography className={classes.Apptitle} variant="h1" noWrap>Select Book</Typography>
          </Button>
          <div className={classes.barGrow} />
          <div className={classes.barSection}>
            <IconButton
              className={classes.barIcon}
              aria-label="show 17 new notifications"
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
            >
              <AccountCircle className={classes.accountCircle} />
            </IconButton>
            <Button className={classes.AppPost} href="/post">
              投稿する
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
