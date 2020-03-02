var inquirer = require("inquirer");
const cTable = require('console.table');
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : 'theLostWorld'
  });
   
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });


console.table([
    {
      name: 'Mario',
      age: 20,
      color: "Red"
    }, {
      name: 'Luigi',
      age: 20,
      color: "Green"
    }
  ]);