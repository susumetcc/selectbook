import React, { useState } from 'react';
import { db } from '../settings/firebase';
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

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {list: cardContents};
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  _isMounted = false; //unmountを判断（ローディング判定用）

  // Firestoreからデータ一覧を取得する
  async componentDidMount() {
    let articlesDb = db.collection("items");
    const articlesSnapshot = await articlesDb.orderBy('createdAt', 'desc').get()
    let usershot = [];
    await db.collection("users").get().then((snapshot) => {
      usershot = snapshot;
    })
    const items = [];
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

    this._isMounted = true;
    this.setState({ list: items });
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

export default Home