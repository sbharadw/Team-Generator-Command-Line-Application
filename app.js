const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const teamMates = [];
//Start from Manager info. 
function init() {
    inquirer.prompt([
        {   // Team Name
            type: "input",
            message: "What is the name of this team/project?",
            name: "teamTitle"
        },
        {   // Manager of the team.
            type: "input",
            message: "Who is the manager of this project?",
            name: "managerName"
        },
        {   // ID.
            type: "input",
            message: "What is the manager's ID?",
            name: "managerID"
        },
        {   // Email.
            type: "input",
            message: "What is the manager's email?",
            name: "managerEmail"
        },
        // Officer Number of the Manager
        {
            type: "input",
            message: "What is the manager's office number?",
            name: "officeNumber"
        }]).then(response => {
            manager = new Manager(response.managerName, response.managerID, response.managerEmail, response.officeNumber);
            teamTitle = response.teamTitle;
            console.log("Next please provide employee information.")
            employeeInfo();
        });
}
//================================================================================================================================================
function employeeInfo() {
    inquirer.prompt([
        {
            type: "list",
            message: "What is this employee's role?",
            name: "employeeRole",
            choices: ["Engineer", "Intern"]
        },
        {
            type: "input",
            message: "What is the employee's name?",
            name: "employeeName"
        },
        {
            type: "input",
            message: "What is the employee's id?",
            name: "employeeId"
        },
        {
            type: "input",
            message: "What is the employee's email?",
            name: "employeeEmail"
        },
        {
            type: "input",
            message: "What is the Engineer's Github?",
            name: "github",
            when: (userResponse) => userResponse.employeeRole === "Engineer"
        },
        {
            type: "input",
            message: "What's the Intern's school?",
            name: "school",
            when: (userResponse) => userResponse.employeeRole === "Intern"
        },
        {
            type: "confirm",
            name: "newEmployee",
            message: "Would you like to add another team member?" // if yes, go back again. If no, renderHTML
        }
    ]).then(answers => {
        if (answers.employeeRole === "Intern") {
            teamMates.push(new Intern(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.school));
        } else if (answers.employeeRole === "Engineer") {
            teamMates.push(new Engineer(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.github));
        }
        if (answers.newEmployee === true) {
            employeeInfo();
        } else {
            //renderHTML
            // Check if the specified output directory already exists
            var main = fs.readFileSync('./templates/main.html', 'utf8');
            // The slashes and g => regular expressions (regex)
            // This allows the replace function to replace all occurances of teamTitle.
            // If I just did '{{teamTitle}}' then it only replaces the first instance.
            main = main.replace(/{{teamTitle}}/g, teamTitle);

            if (!fs.existsSync(OUTPUT_DIR)) {
                    // Since directory doesn't exist, create the specified directory
                    fs.mkdirSync(OUTPUT_DIR);
                }
                // Write out the html page to a file
            fs.writeFile(outputPath, render(teamMates), (err) =>
                    err ? console.error(err) : console.log('A teams file is created in the output folder'));
            
        }
    });
}

init()
