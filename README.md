# Northcoders News API
Project summary:

The purpose of this project is to build an API to access application data programmatically. The intention is to mimic the building of a real-world backend service (such as Reddit) which should provide this information to the front-end architecture.

To access the hosted version, please visit https://magdaleenas-nc-news.onrender.com/api

---

To clone the project, follow these steps:
1. Click on 'Code' and copy the HTTPS link
2. Select a folder in your local machine and run the command: git clone [paste HTTPS link here, remove brackets].

Next, you will need to create the necessary environment variables to run it locally:
1. Create a file named .env.test in the root directory of the project to configure your testing database.
2. In the .env.test file, declare the variable PGDATABASE=[database_name, remove brackets]_test.
3. Similarly, create a file named .env.development in the root directory for your development database.
4. In the development file, specify PGDATABASE=[database_name, remove brackets]_dev.

To set up the project, execute the following commands in your terminal:
1. npm i - to install all necessary dependencies.
2. npm run setup-dbs - this will set up the database.
3. npm seed - to seed the database.
4. npm test - to run the tests.

To successfully run the project, ensure you have the following:
1. Node.js - recommended minimum version 14.x.
2. PostgreSQL - recommended minimum version 12.x.
--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
