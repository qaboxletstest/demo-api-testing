# demo-api-testing

This is a very simple API you can use for learning API Testing. It is built using express and nodejs. It stores data into a JSON File stored under "database" folder with the name "PFMembers.json". There are two endpoints in this api.

1. http://localhost:5002/api/members and
  * GET ALL (/) - This will return all the members. You can also use query parameter to filter out based on gender.
  * GET (/ID) - You can retrieve a specific member based on it's ID.
  * POST (/) - You can POST a new members into PFMembers.json file.
  * PUT (/ID) - You can POST an existing member into PFMembers.json file.
  * DELETE (/ID) - You can DELETE an existing member into PFMembers.json file.
2. http://localhost:5002/api/upload
  * POST (/) - You can POST a new FILE into fileuploads folder.
  
3. INSTALLATION STEPS
  * Install node.js
  * Install VS Code as IDE
  * Install nodemon globally by opening terminal and running the following command : -
    **npm install nodemon -g**
  * Download this project on to your system
  * Open the Project in VS Code and in the integrated terminal of VS Code run the following command: -
    **npm install**
  * To start the project type the following command in the integrated terminal of VS Code: -
    **npm start**
4. By default this project runs on PORT 5002; to change it kindly open app.js file and update the following line of code: -
    **const PORT = process.env.PORT || 5002**
5. This projct has basic authentication in place. So, the hit the endpoints you have to provide the username and password.
  **username = admin** ,
  **password = admin** 
