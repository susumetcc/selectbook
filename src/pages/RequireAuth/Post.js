import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import firebase, { db, storage, auth } from '../../settings/firebase';
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
    this.state = { changeUrlTimer: "", url: "", fetchUrl: false, page: {result: false}, uid: "", reason: "", docId: db.collection("articles").doc().id };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.changeUrl = this.changeUrl.bind(this);
    this.changeReason = this.changeReason.bind(this);
    this.fetchUrl = this.fetchUrl.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  _isMounted = false;

  async componentDidMount() {
    await auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({uid: user.uid});
      }
    })
    this._isMounted = true;
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  }

  changeUrl(e) {
    if(this.state.changeUrlTimer !== "") {
      clearTimeout(this.state.changeUrlTimer);
    }
    let timerId = "";
    if(e.target.value.match(/.+\..+/)) {
      timerId = setTimeout( this.fetchUrl , 5000 );
    }
    this.setState({changeUrlTimer: timerId, url: e.target.value, fetchUrl: false});
    // console.log(e.target.value);
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
    this.setState({reason: e.target.value});
    // console.log(e.target.value);
  }

  async handleOnSubmit() {
    if(!this.state.fetchUrl){
      // Fetchする
      await this.fetchUrl();
    }
    console.log(this.state.page);
    // Fetch先が有効なページだったか確認
    if(this.state.reason.length > 0 && this.state.page.result) {
      // Firestoreに登録
      const docId = this.state.docId;
      db.collection("items").doc(docId).set({
        title: this.state.page.data.ogTitle,
        description: this.state.page.data.ogDescription,
        reason: this.state.reason,
        url: this.state.page.data.url,
        thumbnail: this.state.page.data.ogImage,
        siteName: this.state.page.data.ogSiteName,
        siteType: this.state.page.data.ogType,
        tag: [],
        recommender: this.state.uid,
        like: [],
        star: 0,
        comments: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }).then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        alert("Error writing document: ", error);
      });

      //登録後、Topに移動
      this.props.history.push("/");
    }
    else {
      alert("このURLは現在使用できません。");
      console.log("Error: URLが正しくありません");
    }
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
          <Button
            type="button"
            onClick={this.handleOnSubmit}
            fullWidth
            variant="contained"
            color="primary"
            className={"postSubmitBtn"}
          >
            投稿
          </Button>
        </form>
      </div>
    )
  }
}

export default Post