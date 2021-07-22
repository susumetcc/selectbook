import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { auth, db } from '../settings/firebase';
import PostBody from '../components/PostBody';
import NoImg from '../img/noimg.jpg';

const cardContents = [
  {
    docId: "test0",
    title: "",
    description: "",
    reason: "",
    recommender: "",
    avatarUrl: NoImg,
    thumbnail: NoImg,
  }
]

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {list: cardContents, editor: this.props.match.params.userid, bookid: ""};
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  _isMounted = false; //unmountを判断（ローディング判定用）

  // 最初に読み込むときに行う
  async componentDidMount() {
    let editorid = "";
    await db.collection("displayids").doc(this.state.editor).get().then(async (doc) => {
      if (doc.exists) {
        editorid = doc.data().uid;
        console.log(editorid);
        // Firestoreからデータ一覧を取得する
        let articlesDb = db.collection("items");
        let usershot = [];
        await db.collection("users").get().then((snapshot) => {
          usershot = snapshot;
        })
        const articlesSnapshot = await articlesDb.where("recommender", "==", editorid).orderBy('createdAt', 'desc').get()
        const items = [];
        console.log(articlesSnapshot);
        articlesSnapshot.forEach(doc => {
          let data = doc.data();
          data.docId = doc.id;
          if(data.thumbnail.length === 0) {
            data.thumbnail = NoImg;
          }
          usershot.forEach(userdoc => {
            if(userdoc.id === data.recommender) {
              data.avatarUrl = userdoc.data().avatarUrl;
              data.username = userdoc.data().name;
            }
          });
          items.push(data);
        });
        this.setState({ list: items });
      } else {
        console.log("このアカウントはありません");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });

    this._isMounted = true;
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  }

  render() {
    let list = this.state.list;
    let listItems = []
    for ( const itemdata of list) {
      listItems.push(<PostBody key={itemdata.docId} data={itemdata} />)
    }
    console.log(list);
    return (
      <div style={{display: "flex", flexWrap: "wrap"}}>
        {listItems}
      </div>
    )
  }
}

export default Book