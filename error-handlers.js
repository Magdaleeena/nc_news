exports.psqlErrorHandlerOne = (error, request, response, next) => {
    if(error.code === '23502'){
        response.status(400).send({msg: 'Bad request'})
      }
      next(error)
}
exports.psqlErrorHandlerTwo = (error, request, response, next) => {
    if(error.code === '22P02'){
        response.status(400).send({msg: 'Invalid type'})
      }
      next(error)
}

exports.customErrorHandler = (error, request, response, next) => {
    if(error.status && error.msg){
        response.status(error.status).send({msg: error.msg})
      }
      next(error)
}

exports.serverErrorHandler = (error, request, response, next) => {
    response.status(500).send({ msg: 'Internal server error' })
}