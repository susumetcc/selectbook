import React from "react";
import { Link, Redirect } from 'react-router-dom';
import getQueryStrings from '../../utils/getQueryStrings';

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
    this.state = {redirect: decodeURIComponent(redirect), isSkippable: skippable};
  }

  render() {
    return (
      <>
        <p>設定です</p>
        <Link
          to={this.state.redirect === "/" ? "/" : decodeURIComponent(this.state.redirect)}
        >
          {this.state.isSkippable? "スキップ" : "キャンセル"}
        </Link>
      </>
    )
  }
}