const inquirer = require("inquirer");
const consoleTable = require('console.table');
const mysql = require('mysql');

//creating connection to mysql database
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'theLostWorld',
    database: "employee_tracker"
});

//connection to mysql server
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
    console.log("\n\nWelcome to the Employee tracker!\n\n")
    start();
});

//start application
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All",
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
        .then(function (answer) {
            switch (answer.action) {
                case "View All":
                    viewAll();
                    break;

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
                    console.log("\n\nThank you for using the Employee Tracker.\n\nGoodbye!\n\n")
                    connection.end();
            }
        });
};

function viewAll() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
    function(err, res){
        if (err) throw err;
        console.log("\n")
        console.table(res);
        start();
    })
}

function addEmployee() {
    connection.query('select * from role', function (err, db) {
        let roleChoices = db.map(item => {
            return { name: item.title, value: item.id }
        })
        connection.query('select * from employee', function (err, db) {
            let managerChoices = db.map(item => {
                return { name: item.first_name + " " + item.last_name, value: item.id }
            })
            inquirer
                .prompt([
                    {
                        name: "first_name",
                        type: "input",
                        message: "What is the employees first name?"
                    },
                    {
                        name: "last_name",
                        type: "input",
                        message: "What is the employees last name?"
                    },
                    {
                        name: "role_id",
                        type: "list",
                        message: "What is the employees role?",
                        choices: roleChoices
                    },
                    {
                        name: "manager_id",
                        type: "list",
                        message: "Who is the employees manager?",
                        choices: managerChoices
                    }
                ])
                .then(function (answer) {
                    connection.query(
                        "INSERT INTO employee SET ?", answer,

                        function (err) {
                            if (err) throw err;
                            let values = [
                                [answer.first_name, answer.last_name]
                            ]
                            console.log("\nAdded Employee sucessfully!\n")
                            console.table(["First Name", "Last Name"], values)
                            start();
                        }
                    )
                })
        })
    })
}

function addRole() {
    connection.query("select * from department", function (err, db) {
        let depChoices = db.map(event => {
            return {
                name: event.name,
                value: event.id
            }
        })
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What role would you like to add?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary? Enter Number: ",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        } console.log("\n Salary must be a number")
                        return false
                    }
                },
                {
                    name: "department_id",
                    type: "list",
                    message: "What department does this role fall into?",
                    choices: depChoices


                }
            ])
            .then(function (answer) {
                connection.query(
                    "INSERT INTO role SET ?", answer,
                    function (err) {
                        if (err) throw err;
                        let values = [
                            [answer.title]
                        ]
                        console.log("\nAdded role sucessfully!\n")
                        console.table(["Role Name",], values)
                        start();
                    }
                )
            })
    })
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "departmentName",
                type: "input",
                message: "What department would you like to add?"
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.departmentName
                },
                function (err) {
                    if (err) throw err;
                    let values = [[answer.departmentName]]
                    console.log("\n Department role sucessfully! \n")
                    console.table(["Department Name"], values)
                    start();
                }
            )
        })
}

function viewEmployees() {
    connection.query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS Employees FROM employee;"
    ,function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        start();
    })
}

function viewRoles() {
    connection.query("SELECT role.title, role.salary, department.name AS department FROM role LEFT JOIN department on role.department_id = department.id", 
    function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        start();
    })
}

function viewDepartments() {
    connection.query("SELECT department.name FROM department", function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        start();
    })
}

function updateEmployeeRoles() {
    connection.query('select * from employee', function(err, res){
        let employeeToUpdate = res.map(item => {
            return {name: item.first_name + " " + item.last_name, value: item.id}
        })
    
    connection.query('select * from role', function(err, res){
        let updatedRole = res.map(item=> {
            return {name: item.title, value: item.id}
        })
    
    inquirer.prompt([
        {
            name: 'employee',
            type: 'list',
            message: "Who's role would you like to update",
            choices: employeeToUpdate
        },
        {
            name: 'role',
            type: 'list',
            message: 'What new role would you like to assign to them',
            choices: updatedRole
        }
    ])
    .then(function (answer){
            console.log("\nThis is currently under construction, try again later!\n");
            start();
            // connection.query('UPDATE employee SET role_id = ? WHERE id = ?',
            // [
            //     {role: answer.role}, {employee: answer.employee}
            // ],
            // function(err, res) {
            //     if (err) throw err;
            // }
            // )
            
            })
        })
    })
}