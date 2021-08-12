var crypto = require('crypto');

var mykey = crypto.createCipher('aes-256-cbc', 'souviksecret');
var mystr = mykey.update('abc', 'utf8', 'hex')
mystr += mykey.final('hex');
var enData = mystr
console.log(mystr); 

var mykey = crypto.createDecipher('aes-256-cbc', 'souviksecret');
var mystr = mykey.update(enData, 'hex', 'utf8')
mystr += mykey.final('utf8');

console.log(mystr);

let hp = {a:'',b:''};
var arr = [] ;
arr.push(hp);

arr[0].a = "20";
hp.b = "30"
console.log("arr data",arr[0].a);
console.log("hp data",hp.a);
console.log(arr[0].b);