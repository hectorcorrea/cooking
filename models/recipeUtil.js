var getUrlFromName = function(name) {
  var i, c;
  var url = "";

  // if(name === undefined) {
  //   return "";
  // }

  name = name.trim().toLowerCase();

  for(i=0; i<name.length; i++) {
    c = name[i];
    if(c >= 'a' && c <= 'z')
      url += c;
    else if(c >= '0' && c <= '9')
      url += c;
    else
      url += '-';
  }

  while(url.indexOf('--') > -1) {
    url = url.replace('--', '-');
  }

  if(url.charAt(url.length-1) === '-') {
    url = url.substr(0, url.length-1);
  }

  return url
};


module.exports = {
  getUrlFromName: getUrlFromName
};
