# demo-api-testing

This is a very simple API you can use for learning API Testing. It is built using express and nodejs. It stores data into a JSON File stored under "database" folder with the name "PFMembers.json". There are two endpoints in this api.

1. ### Members - http://localhost:5002/api/members
    * GET ALL (/) - This will return all the members. You can also use query parameter to filter out based on gender.
    * GET (/ID) - You can retrieve a specific member based on it's ID.
    * POST (/) - You can POST a new members into PFMembers.json file.
    * PUT (/ID) - You can UPDATE an existing member into PFMembers.json file by providing BOTH NAME and GENDER.
    * PATCH (/ID) - You can UPDATE an existing member into PFMembers.json file by providing either NAME or GENDER or BOTH.
    * DELETE (/ID) - You can DELETE an existing member into PFMembers.json file.
    * Both JSON and XML responses are available.
2. ### File Upload - http://localhost:5002/api/upload
    * POST (/) - You can POST a new FILE into fileuploads folder.
3. ### File Download - http://localhost:5002/api/download?name=FileNameWithExtension
    * GET (/) - You can download a FILE. e.g. http://localhost:5002/api/download?name=Test.jpg
4. ### Delayed Response - http://localhost:5002/api/lag?delay=TimeInMilliSeconds
    * Change TimeInMilliSeconds with Appropriate Value e.g. http://localhost:5002/api/lag?delay=3000 would delay the response by 3 Seconds
5. ### INSTALLATION STEPS
      * Install node.js
      * Install VS Code as IDE
      * Install nodemon globally by opening terminal and running the following command : -
         - **npm install nodemon -g**
      * Download this project on to your system
      * Open the Project in VS Code and in the integrated terminal of VS Code run the following command: -
         - **npm install**
      * To start the project type the following command in the integrated terminal of VS Code: -
         - **npm start**
6. By default this project runs on PORT 5002; to change it kindly open app.js file and update the following line of code: -
    - **const PORT = process.env.PORT || 5002**
7. This projct has basic authentication in place. So, the hit the endpoints you have to provide the username and password.
    - **username = admin**
    - **password = admin**
