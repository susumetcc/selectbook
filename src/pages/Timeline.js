import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { db } from '../settings/firebase';
import PostBody from '../components/PostBody';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
}));

function Timeline() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <PostBody data="this" />
      <PostBody />
      <PostBody />
      <PostBody />
    </div>
  )
}

export default Timeline