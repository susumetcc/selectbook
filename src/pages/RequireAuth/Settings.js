import React from "react";
import { Link, Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from "@material-ui/core/IconButton";
import Avatar from '@material-ui/core/Avatar';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import firebase, { auth, db, storage } from "../../settings/firebase";
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
    this.state = {
      redirect: decodeURIComponent(redirect),
      isSkippable: skippable,
      nowname: "",
      name: "",
      nowavatarUrl: "",
      avatarUrl: "",
      avatarBase64: "",
      avatarImgType: "",
      nowdisplayId: "",
      displayId: "",
      ngDisplayId: false,
      isChangedName: 2,
      isChangedAvatar: 2,
      isChangedDid: 2,
      open: false,
      snackmessage: "",
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeAvatarUrl = this.changeAvatarUrl.bind(this);
    this.changeDisplayId = this.changeDisplayId.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.alertClose = this.alertClose.bind(this);
  }

  _isMounted = false;

  componentDidMount() {
    const user = auth.currentUser;
    if (user !== null) {
      this.setState({
        nowname: user.displayName, name: user.displayName,
        nowavatarUrl: user.photoURL, avatarUrl: user.photoURL,
      });
      db.collection("users").doc(user.uid).get().then((doc) => {
        this.setState({nowdisplayId: doc.data().displayid, displayId: doc.data().displayid})
      })
    }
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  changeName(e) {
    let changed = 1;
    if (e.target.value === "") {
      changed = 0;
    } else if (e.target.value === this.state.nowname) {
      changed = 2;
    }
    this.setState({name: e.target.value, isChangedName: changed});
  }

  // アバターアイコン画像をアップロードしたとき
  changeAvatarUrl(e) {
    console.log(e.target.files)
    let photoUrl = this.state.nowavatarUrl;
    let changed = 1;
    let type = "";
    if (e.target.files.length === 0) {
      changed = 2;
    } else if (e.target.files[0].size < 1000000 || ["image/png", "image/jpeg"].indexOf(e.target.files[0].type)) {
      const imageFile = e.target.files[0];
      photoUrl = URL.createObjectURL(imageFile);
      type = imageFile.type;
      const reader = new FileReader();
      const avatarthis = this;
      reader.addEventListener("load", function () {
        // 画像ファイルを base64 文字列に変換
        avatarthis.setState({avatarBase64: reader.result})
      }, false);
      reader.readAsDataURL(imageFile)
    } else {
      changed = 0;
    }
    this.setState({avatarUrl: photoUrl, avatarImgType: type, isChangedAvatar: changed});
  }

  async changeDisplayId(e) {
    this.setState({displayId: e.target.value});
    let changed = 1;
    let ngDisplayid = false;
    if (e.target.value.length < 3) {
      changed = 0;
    } else if (e.target.value === this.state.nowdisplayId) {
      changed = 2;
    } else {
      await db.collection("displayids").doc(e.target.value).get()
      .then((doc) => {
        if (doc.exists) {
          changed = 0;
          ngDisplayid = true;
        }
      })
    }
    this.setState({isChangedDid: changed, ngDisplayId: ngDisplayid});
  }

  async updateProfile() {
    const user = firebase.auth().currentUser;
    const userDocRef = db.collection("users").doc(user.uid);

    let profData = {};
    // 表示名の更新
    if(this.state.name !== "" && this.state.name !== this.state.nowname) {
      profData.displayName = this.state.name;
      await userDocRef.update({name: this.state.name});
    }
    // アバター画像の更新
    if(this.state.avatarUrl !== "" && this.state.avatarUrl !== this.state.nowavatarUrl) {
      let filepath = "profile/" + user.uid;
      if (this.state.avatarImgType === "image/png") {
        filepath += ".png";
      } else if (this.state.avatarImgType === "image/jpeg") {
        filepath += ".jpg";
      }
      const storageRef = storage.ref().child(filepath);
      await storageRef.delete().then(async function() {
        console.log("現在のプロフィール画像を削除しました");
      }).catch(function(error) {
        console.log(error, "現在のプロフィール画像を削除できませんでした");
      });
      // BASE64ファイルをアップロード
      const imgString = this.state.avatarBase64;
      await storageRef.putString(imgString, "data_url")
      .then(async function(snapshot) {
        console.log('Uploaded a blob or file!');
        await storageRef.getDownloadURL().then(async function (url) {
          profData.photoURL = url;
          await userDocRef.update({avatarUrl: url});
        })
      }).catch(function(error) {
        console.log(error, "ファイルをアップできませんでした");
      });
    }
    // マイページIDの更新
    if(this.state.isChangedDid === 1) {
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
      this.setState({isChanged: false, isChangedName: 2, isChangedAvatar: 2, isChangedDid: 2, open: true, snackmessage: "プロフィールを更新しました。"});
    }).catch((error) => {
      console.log(error);
      this.setState({open: true, snackmessage: "問題が発生しました。もう一度お試しください。"});
    }); 
  }

  alertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({open: false});
  };

  render() {
    console.log(this.state)
    return (
      <>
        <p>設定です</p>
        <IconButton
          edge="end"
          className={"settngs-icon"}
          aria-label="account of current user"
          aria-haspopup="true"
          component="label"
        >
          <Avatar alt={this.state.nowname} src={this.state.avatarUrl} style={{height:"40px", width:"40px"}} />
          <input
            type="file"
            onChange={this.changeAvatarUrl}
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
          />
        </IconButton>
        <div className={"inputarea"}>
          <TextField id="input-displayname" className={"inputsettng"} label="表示名" variant="outlined" value={this.state.name} onChange={this.changeName} />
        </div>
        <div className={"inputarea"}>
          <TextField id="input-displayid" className={"inputsettng"} label="マイページアドレス" variant="outlined" value={this.state.displayId} onChange={this.changeDisplayId} />
          <p>
            {this.state.displayId.length >= 3 ?
              this.state.ngDisplayId? "このIDはすでに使用されています" : "このIDを使用できます"
            :
              "IDは3文字以上の半角英数字またはハイフン( - )、アンダースコア( _ )である必要があります"
            }
          </p>
        </div>
        <SaveBtn
          handleSave={this.updateProfile}
          enable={
            this.state.isChangedName * this.state.isChangedAvatar * this.state.isChangedDid === 0 || this.state.isChangedName * this.state.isChangedAvatar * this.state.isChangedDid === 8?
            false: true
          }
        />
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
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.open}
          autoHideDuration={4000}
          onClose={this.alertClose}
          message={this.state.snackmessage}
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={this.alertClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        >
        </Snackbar>
      </>
    )
  }
}