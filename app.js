const cors = require('cors');
const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");

const { psqlErrorHandlerOne, psqlErrorHandlerTwo, psqlErrorHandlerThree, customErrorHandler, serverErrorHandler } = require("./error-handlers");

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.all("*", (request, response, next) => {
    response.status(404).send({msg: 'Path not found'})
})

app.use(psqlErrorHandlerOne);
  
app.use(psqlErrorHandlerTwo);

app.use(psqlErrorHandlerThree);
 
app.use(customErrorHandler); 

app.use(serverErrorHandler);
  
module.exports = app;