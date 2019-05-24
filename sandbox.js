var myString =
  "oauth_token_secret=5AArgdVpMAYPWux7&oauth_token=t5110709232173056";

var myReg = /(?![oauth_token_secret=]).{16}/;

var myResult = myString.match(myReg)[0];

console.log(myResult);
