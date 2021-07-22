import React from 'react';
import { auth } from '../../settings/firebase';
import getQueryStrings from '../../utils/getQueryStrings';

async function logout() {
  auth.signOut();
  await new Promise(resolve => setTimeout(resolve, 3000));
  const redirect = getQueryStrings(window.location.search)["redirect"];
  if(redirect) {
    window.location.href = decodeURIComponent(redirect);
  } else {
    window.location.href = "/";
  }
}

function Signout() {
  logout();
  return (
    <div>
      サインアウトしました。<br/>まもなくページが移動します。
    </div>
  )
};

export default Signout;