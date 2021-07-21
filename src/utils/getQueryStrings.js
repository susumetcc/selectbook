// URLのクエリを取得する
function getQueryStrings(query) {
  let queries = {};
  if(query) {
    query.slice(1).split('&').forEach(function(query) {
      // = で分割してkey,valueをオブジェクトに格納
      var queryArr = query.split('=');
      queries[queryArr[0]] = decodeURIComponent(queryArr[1]);
      console.log(queries);
    });
  }
  return queries;
}

export default getQueryStrings;