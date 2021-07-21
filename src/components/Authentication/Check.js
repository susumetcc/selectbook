import React, { useState } from 'react';
import { auth } from '../../settings/firebase';

function AuthCheck({children, signout = false}) {
  const [signin, setSignin] = useState(false);
  //ログインしてるかどうかチェック
  auth.onAuthStateChanged(user => {
    if (user) {
      setSignin(true);
    } else {
      setSignin(false);
    }
  })

  return(
    <>
      {(signin && !signout) || (!signin && signout)? children : <></> }
    </>
  );
}

export default AuthCheck;