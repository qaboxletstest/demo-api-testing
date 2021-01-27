# demo-api-testing

This is a very simple API you can use for learning API Testing. It is built using express and nodejs. It stores data into a JSON File stored under "database" folder with the name "PFMembers.json". There are two endpoints in this api.

1. http://localhost:5002/api/members and
  a. GET ALL (/) - This will return all the members. You can also use query parameter to filter out based on gender.
  b. GET (/ID) - You can retrieve a specific member based on it's ID.
  c. POST (/) - You can POST a new members into PFMembers.json file.
  d. PUT (/ID) - You can POST an existing member into PFMembers.json file.
  e. DELETE (/ID) - You can DELETE an existing member into PFMembers.json file.
2. http://localhost:5002/api/upload
  a. POST (/) - You can POST a new FILE into fileuploads folder.
  
3. INSTALLATION STEPS
  a. Install node.js
  b. Install VS Code as IDE
  c. Install nodemon globally by opening terminal and running the following command : -
    npm install nodemon -g
  d. Download this project on to your system
  e. Open the Project in VS Code and in the integrated terminal of VS Code run the following command: -
    npm install
  f. To start the project type the following command in the integrated terminal of VS Code: -
    npm start
  6. By default this project runs on PORT 5002; to change it kindly open app.js file and update the following line of code: -
    const PORT = process.env.PORT || 5002
