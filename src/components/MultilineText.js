import React from 'react';

export default class MultiLineText extends React.Component {
  render() {
    const renderTexts = () => {
      if (typeof(this.props.children) === "string") {
        return this.props.children.split("\n").map((m,i) => <span key={i}>{m}<br/></span>)
      } else {
        return "";
      }
    }
    return (
      <span className={this.props.className}>
        {renderTexts()}
      </span>
    );
  }
}