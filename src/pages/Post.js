import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import './Post.css'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));


class Post extends React.Component {
  constructor(props){
    super(props);
    this.state = { changeUrlTimer: "", url: "", fetchUrl: false, page: {} };
    this.changeUrl = this.changeUrl.bind(this);
    this.fetchUrl = this.fetchUrl.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  changeUrl(e) {
    if(this.state.changeUrlTimer !== "") {
      clearTimeout(this.state.changeUrlTimer);
    }
    let timerId = "";
    if(e.target.value.match(/.+\..+/)) {
      timerId = setTimeout( this.fetchUrl , 8000 );
    }
    this.setState({changeUrlTimer: timerId, url: e.target.value, fetchUrl: false});
    console.log(e.target.value);
  }

  // URLからOGPを取得する
  async fetchUrl() {
    console.log(this.state.url)
    const url = "https://selectbook-bot.herokuapp.com/get?url=" + this.state.url;
    const requestOptions ={
      method: 'GET',
      headers:{'Content-Type': 'application/json'},
    };
    await fetch(url,requestOptions).then((response)=> response.json()
    ).then((responseJson) =>{
      this.setState({page: responseJson});
      console.log(responseJson);
    })
    this.setState({changeUrlTimer: "", fetchUrl: true});
  }

  changeReason(e) {
    console.log(e.target.value);
  }

  async handleOnSubmit() {
    if(!this.state.fetchUrl){
      // Fetchする
      await this.fetchUrl();
    }
    console.log(this.state.page);
    // Firestoreに登録
  }

  render() {
    return (
      <div className={"postdiv"}>
        <p>おすすめの記事を<br/>投稿しましょう！</p>
        <form className={useStyles.root + " postForm"} onSubmit={this.handleOnSubmit} noValidate autoComplete="off">
          <div className={"inputarea"}>
            <TextField id="input-link1" className={"inputbox"} label="URLをペーストしてください" variant="outlined" onChange={this.changeUrl} />
          </div>
          <div className={"inputarea"}>
            <TextField id="input-link2" className={"inputbox"} label="理由を書いてください" variant="outlined" multiline={true} rows="6" onChange={this.changeReason} />
          </div>
          <Button type="button" onClick={this.handleOnSubmit} className={"postSubmitBtn"}>投稿</Button>
        </form>
      </div>
    )
  }
}

export default Post