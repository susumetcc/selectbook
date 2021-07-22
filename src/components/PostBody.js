import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from "@material-ui/core/IconButton";
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import MultilineText from './MultilineText';
import NoImg from '../img/noimg.jpg';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: "10px",
    width: "330px",
    height: "400px",
    background: "rgba(254, 253, 248, 0.94)",
    /* dropshadow_color */
    boxShadow: "0px 4px 15px rgba(124, 121, 107, 0.25)",
  },
  // 推薦理由
  suggestTitle: {
    display: "flex",
    cursor: "pointer",
    width: "300px",
    height: "70px",
    // フォント
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "12px",

    alignItems: "center",
    textAlign: "justify",
    letterSpacing: "0.03em",
    color: "#555046",
  },
  suggestTitleMultiline: {
    display: "-webkit-box",
    overflow: "hidden",
    "-webkit-line-clamp": "3",
    "-webkit-box-orient": "vertical",
  },
  // 推薦記事表示領域
  suggestedView: {
    width: "300px",
    height: "250px",
    background: "#FFFFFF",
  },
  image: {
    width: "300px",
    height: "160px",
    overflow: "hidden",
  },
  img: {
    margin: 'auto',
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: "cover",
  },
  /* SuggestedContent */
  suggestedContent: {
    width: "300px",
    height: "28px",
    marginBottom: "7px",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize:"10px",
    textAlign: "center",
    color: "#8B8A84",
    display: "-webkit-box",
    overflow: "hidden",
    "-webkit-line-clamp": "2",
    "-webkit-box-orient": "vertical",
  },
  suggestedTitle: {
    width: "300px",
    height: "17px",
    marginTop: "7px",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize:"10px",
    textAlign: "center",
    color: "#555046",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

export default function PostBody(props) {
  const classes = useStyles();
  // 渡されたデータの取得
  const { data } = props;
  console.log(data)

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={0} direction="column" style={{ alignItems: "center", justifyContent: "center"}}>
        <Grid item>
          <Typography variant="body2" className={classes.suggestTitle}>
            <MultilineText className={classes.suggestTitleMultiline}>{data.reason}</MultilineText>
          </Typography>
        </Grid>
        <Grid item xs={12} sm container className={classes.suggestedView} direction="column">
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={data.thumbnail} />
            </ButtonBase>
          </Grid>
          <Grid item xs>
            <Typography gutterBottom variant="subtitle1" className={classes.suggestedTitle}>
              {data.title}
            </Typography>
            <Typography variant="body2" className={classes.suggestedContent}>
              {data.description}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid style={{display: "flex", justifyContent: "flex-end", width: "300px"}}>
        <IconButton
          className={classes.barIcon}
          aria-label="show 17 new notifications"
        >
          <BookmarkBorderOutlinedIcon style={{width: "36px", height: "36px"}} />
        </IconButton>
      </Grid>
    </Paper>
  );
}