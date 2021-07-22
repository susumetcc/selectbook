import React, { useState } from 'react';
import { auth } from '../../settings/firebase';

function AuthCheck({children, signout = false}) {
  const [signin, setSignin] = useState(false);
  const [signcheck, setSigncheck] = useState(false);
  //ログインしてるかどうかチェック
  auth.onAuthStateChanged(user => {
    if (user) {
      setSignin(true);
    } else {
      setSignin(false);
    }
    setSigncheck(true);
  })

  if (signcheck) {
    return(
      <>
        {(signin && !signout) || (!signin && signout)? children : <></> }
      </>
    );
  } else {
    return (<></>);
  }
}

export default AuthCheck;