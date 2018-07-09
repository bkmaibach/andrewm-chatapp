const moment = require('moment');

//In node, timestamps are MILLIseconds since epoch
var date = new Date();

var date = moment();
date.add(1, 'year').subtract(9, 'months')
console.log(date.format('MMM Do YYYY, h:mm:ss a'));