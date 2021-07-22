import React from "react";
import { Link, Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import firebase, { db } from "../../settings/firebase";
import getQueryStrings from '../../utils/getQueryStrings';

// 保存ボタン
function SaveBtn(props) {
  const { handleSave, enable } = props;
  return (
    <Button
      type="button"
      onClick={handleSave}
      disabled={!enable}
      fullWidth
      variant="contained"
      color="primary"
      className={"saveSettingsBtn"}
    >
      保存
    </Button>
  )
}

// 設定画面
export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    const query = window.location.search;
    let redirect = "/";
    let skippable = false;
    if (query) {
      const queries = getQueryStrings(query);
      redirect = queries["redirect"];
      if (queries["skippable"] === "true") skippable = true;
    }
    this.state = {redirect: decodeURIComponent(redirect), isSkippable: skippable, name: "", avatarUrl: "", displayId: "", ngDisplayId: false, isChanged: false};
    this.changeName = this.changeName.bind(this);
    this.changeAvatarUrl = this.changeAvatarUrl.bind(this);
    this.changeDisplayId = this.changeDisplayId.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  changeName(e) {
    let changed = true;
    if (e.target.value === "") changed = false;
    this.setState({name: e.target.value, isChanged: changed});
  }

  changeAvatarUrl(e) {
    let changed = true;
    if (e.target.value === "") changed = false;
    this.setState({avatarUrl: e.target.value, isChanged: changed});
  }

  async changeDisplayId(e) {
    let changed = true;
    let ngDisplayid = false;
    if (e.target.value.length < 3) {
      changed = false;
    } else {
      await db.collection("displayids").doc(e.target.value).get()
      .then((doc) => {
        if (doc.exists) {
          changed = false;
          ngDisplayid = true;
        }
      })
    }

    this.setState({displayId: e.target.value, isChanged: changed, ngDisplayId: ngDisplayid});
  }

  async updateProfile() {
    const user = firebase.auth().currentUser;
    const userDocRef = db.collection("users").doc(user.uid);

    let profData = {};
    if(this.state.name !== "") {
      profData.displayName = this.state.name;
      await userDocRef.update({name: this.state.name});
    }
    if(this.state.avatarUrl !== "") {
      profData.photoURL = this.state.avatarUrl;
      await userDocRef.update({avatarUrl: this.state.avatarUrl});
    }
    if(this.state.displayId.length >= 3) {
      const docRef = db.collection("displayids").doc(this.state.displayId);
      await db.runTransaction((transaction) => {
        return transaction.get(docRef).then(async(sfDoc) => {
          if (sfDoc.exists) {
            throw "このIDはすでに使用されています";
          }
          await transaction.get(userDocRef).then(async (userDoc) => {
            if (!userDoc.exists) {
              throw "ユーザIDが見つかりません";
            }
            const delDocRef = db.collection("displayids").doc(userDoc.data().displayid);
            await transaction.set(docRef, { uid: user.uid });
            await transaction.update(userDocRef, { displayid: this.state.displayId });
            await transaction.delete(delDocRef);
          })
        });
      });
    }

    user.updateProfile(profData).then(() => {
      console.log("プロフィールを更新しました");
      this.setState({isChanged: false});
    }).catch((error) => {
      console.log(error);
    }); 
  }

  render() {
    return (
      <>
        <p>設定です</p>
        <div className={"inputarea"}>
          <TextField id="input-displayname" className={"inputsettng"} label="表示名" variant="outlined" onChange={this.changeName} />
        </div>
        <div className={"inputarea"}>
          <TextField id="input-avatar" className={"inputsettng"} label="アバターURL" variant="outlined" onChange={this.changeAvatarUrl} />
        </div>
        <div className={"inputarea"}>
          <TextField id="input-displayid" className={"inputsettng"} label="マイページアドレス" variant="outlined" onChange={this.changeDisplayId} />
          <p>
            {this.state.displayId.length >= 3 ?
              this.state.ngDisplayId? "このIDはすでに使用されています" : "このIDを使用できます"
            :
              ""
            }
          </p>
        </div>
        <SaveBtn handleSave={this.updateProfile} enable={this.state.isChanged} />
        <Button
          component={Link}
          to={this.state.redirect === "/" ? "/" : decodeURIComponent(this.state.redirect)}
          fullWidth
          variant="contained"
          color="secondary"
          className={"cancelSettingsBtn"}
        >
          {this.state.isSkippable? "スキップ" : "キャンセル"}
        </Button>
      </>
    )
  }
}