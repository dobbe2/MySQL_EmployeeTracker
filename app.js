var inquirer = require("inquirer");
const cTable = require('console.table');
var mysql      = require('mysql');

//creating connection to mysql database
var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : 'theLostWorld',
    database : "employee_tracker"
  });
   
//connection to mysql server
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
    start();
  });

function start(){
inquirer
.prompt({
    name: "action",
    type: "rawlist",
    message: "What would you like to do?",
    choices: [
        "Add Employee", 
        "Add Role",
        "Add Department",
        "View Employees",
        "View Roles",
        "View Departments",
        "Update Employee Roles",
        "Exit"
    ]
})
.then(function(answer) {
    switch (answer.action){
        case "Add Employee":
            addEmployee();
            break;

        case "Add Role":
            addRole();
            break;

        case "Add Department":
            addDepartment();
            break;

        case "View Employees":
            viewEmployees();
            break;

        case "View Roles":
            viewRoles();
            break;

        case "View Departments":
            viewDepartments();
            break;

        case "Update Employee Roles":
            updateEmployeeRoles();
            break;

        case "Exit":
        connection.end();
        }
    });
};

function addEmployee(){
    inquirer
    .prompt([
        {
        name: "firstName",
        type: "input",
        message: "What is the employees first name?"
    },
    {
        name: "lastName",
        type: "input",
        message: "What is the employees last name?"
    },
    {
        name: "role",
        type: "input",
        message: "What is the employees role? Insert Number for now: ",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } console.log("\n must be a number for now, sorry")
            return false
           
        }
    }
    ])
    .then(function(answer) {
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: answer.role
            },
            function (err) {
                if (err) throw err;
                let values = [
                    [answer.firstName,answer.lastName, answer.role]
                ]
                console.log("Added employee sucessfully!")
                console.table(["First Name", "Last Name", "Role ID Number"], values)
                start();
            }
        )
    })
}

function addRole(){
    inquirer
    .prompt([
        {
        name: "roleName",
        type: "input",
        message: "What role would you like to add?"
        },
        {
        name: "salary",
        type: "input",
        message: "What is the salary? Enter Number: ",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } console.log("\n Salary must be a number")
            return false
            }
        },
        {
            name: "department_id",
            type: "input",
            message: "What department is this? Number for now",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }console.log("\n Department must be a number for now")
                return false
            }

        }
    ])
    .then(function(answer){
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: answer.roleName,
                salary: answer.salary,
                department_id: answer.department_id
            },
            function (err) {
                if (err) throw err;
                let values = [
                    [answer.roleName, answer.salary, answer.department_id]
                ]
                console.log("Added role sucessfully!")
                console.table(["Role Name", "Role Salary", "Role ID Number"], values)
                start();
            }
        )
    })
}

function addDepartment(){
    inquirer
    .prompt([
        {
        name: "departmentName",
        type: "input",
        message: "What department would you like to add?"
        }
    ])
    .then(function(answer){
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: answer.departmentName
            },
            function (err) {
                if (err) throw err;
                let values = answer.departmentName
                console.log("Department role sucessfully!")
                console.table(["Department Name"], values)
                start();
            }
        )
    })
}