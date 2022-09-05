"use strict;";
const { bash } = require("./ammBashColors");

// function logErrors(err, req, res, next) {
//     console.error(err.stack)
//     next(err)
// }

function logErrors(error, req, res, next) {
  console.log(bash.bgM, "Error Handling Middleware called");
  // console.error(error.stack)

  console.error(error);
  // console.log('Path: ', req.path)
  console.log(bash.error, "Path: " + req.path);

  // console.error('Error: ', error)
  console.log("error type = ", error.type);
  // console.log(bash.bgG, 'Log Errors')
}

exports.error = (error, req, res, next) => {
  if (error.type == "redirect") {
    res.redirect("/error");
    logErrors(error, req, res, next);
  } else if (error.type == "time-out") {
    // arbitrary condition check
    res.status(408).send(error);
    logErrors(error, req, res, next);
  } else {
    // res.status(500).send(error)
    // res.send('unknown error');
    // res.status(500).send('internal server error')
    res.status(500);
    res.render("error/error500", {
      title: "Error HTTP 500",
      // area: 'asa',
      // abtStr: abtStr
    });
    logErrors(error, req, res, next);
  }
};
