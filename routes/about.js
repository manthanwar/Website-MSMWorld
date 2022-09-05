/**
 * @description This file sets node express routes to: /pub/
 * @since 20211208-1836
 * @author  Amit M. Manthanwar <manthanwar@hotmail.com>
 * @link    https://manthanwar.github.io
 * @license free for personal use, commercial restricted without license
 */

const fs = require("fs");
const path = require("path");
//const https = require('https');
// const http = require('http');

// const zlib = require('zlib');

const express = require("express");
const router = express.Router();
router.use("/", express.static(path.join(__dirname, "./../public")));

// const { nextTick } = require('process');
// const emailer = require('./../code/js/nodeEmailer');
// const ammCrypto = require('./../code/js/ammCrypto');

// const ammHash = require('./../code/js/ammHash');
// const crypto = require('crypto');
const { bash } = require("../code/js/ammBashColors.js");
// const ammObj = require('./../code/js/ammObj');

router.get("/", function (req, res) {
  const data = require("../views/about/about.js");

  let hbsFile = "pageSplash";

  res.render(hbsFile, {
    title: "About",
    // area: 'Health',
    // areaLink: '/health',
    data,
    dataStr: JSON.stringify(data),
  });
});

router.get("/mission", function (req, res) {
  res.render("about/mission", {
    title: "Materich Mission",
    // area: 'Health',
    // areaLink: '/health'
  });
});

router.get("/contact", function (req, res) {
  const data = require("../views/about/contacts.js");

  let hbsFile = "pageSplash";

  res.render(hbsFile, {
    title: "Materich Contact",
    // area: 'Health',
    // areaLink: '/health',
    data,
    dataStr: JSON.stringify(data),
  });
});

router.get("/feedback", function (req, res) {
  res.render("about/feedback", {
    title: "Materich Feedback",
    // area: 'Health',
    // areaLink: '/health'
  });
});

router.post("/feedback", function (req, res) {
  res.render("about/feedback", {
    title: "Materich Feedback",
    // area: 'Health',
    // areaLink: '/health'
  });
});

router.post("/feedback", function (req, res) {
  console.log(req.protocol + "://" + req.get("host") + req.originalUrl);
  console.log("email = ", req.body.email);

  // let encEmail = ammCrypto.encode(dataObj.email);

  // let encEmail = ammHash.saltHashSalt(dataObj.email, 'newUser');
  // console.log('encoded = ', encEmail);

  // if (req.body.email) {

  let output;

  let dataObj = {
    nameF: req.body.nameF,
    nameL: req.body.nameL,

    // phISD: req.body.phISD,  // phone isd code
    // phone: req.body.phone,

    email: req.body.email,
    ipApi: req.body.ipApi,

    // coLat: req.body.coLat,
    // coLon: req.body.coLon,

    //usrID: new Date().toISOString() + req.body.email,
    dated: new Date().getMilliseconds(),
  };

  // let emailHash = 'user' + ammHash.hashFnv32a(dataObj.email);
  // console.log('hah32 = ', emailHash);

  // let decObj = cryptoAmm.decode(encObj);

  // console.log('decoded = ', decObj);

  // let usrFile = dataPath + dataObj.email + '.txt';

  // console.log('usrFile = ', usrFile);

  let dataPath = path.join(__dirname, "../data/users/");
  let fileName = dataPath + "feedback.json";

  // let usrDir = path.join(dataPath, emailHash);

  if (fs.existsSync(dataPath)) {
    // WRITE TO FILE
    // dataObj
    res.redirect("/login/registerSuccess");

    console.log("output = ", output);

    // fs.appendFile('message.txt', 'data to append', function (err) {
    //     if (err) throw err;
    //     console.log('Saved!');
    // });
  } else {
    fs.mkdirSync(dataPath, { recursive: true });

    output = `
             <ul>  
                 <li>Name:   ${req.body.nameF} ${req.body.nameL}</li>
                 <li>Phone:  ${req.body.phone} </li>
                 <li>Email:  ${req.body.email} </li>
                 <li>Notes:  ${req.body.union} </li>
               </ul>
         `;

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"amit" <manthanwar@hotmail.com>', // sender address
      // to: 'manthanwar@hotmail.com', // list of receivers
      subject: "Online Feedback", // Subject line
      // text: 'Hello world?', // plain text body
      // html: output // html body
    };

    // mailOptions.subject = 'New bapFoundation Registration'; // Subject line

    if (req.body.email) {
      mailOptions.to = req.body.email; // list of receivers

      mailOptions.html = `
             <p>Dear ${req.body.nameF} ${req.body.nameF} <p>
             <br>
             <p>Thank you for your valuable feedback at our 
             <a href="www.materich.com">Website</a>.</p>
     
             <h3>Submitted details are</h3>
            
             ${output} 
             
             <br>
     
             <p>We shall get in touch with you soon.</p>
             
             <br>
     
             <p>Sincerely,</p>
             <p>Team Materich</p>
             `;

      try {
        // emailer.sendMail(mailOptions)
      } catch (err) {
        console.log("Error: ", err);
      }

      // console.log('myMessage = ', emailer.purpose);
    }

    // list of receivers
    // mailOptions.to = 'info@bapfoundation.org, chandra5.mglobal@gmail.com';
    // mailOptions.html = '<p>A new bap Foundation registered user</p>' + output;
    // sendMail(mailOptions);

    // let dataObj = 'ami';

    // let encObj = cryptoAmm.encode(dataObj);
    // let decObj = cryptoAmm.decode(encObj);

    // let deflated = zlib.deflateSync(encObj).toString('base64');
    // let inflated = zlib.inflateSync(Buffer.from(deflated, 'base64')).toString();
    // let decObj = crypto.decode(inflated);

    // console.log('dataObj = ', dataObj);
    // console.log('encoded = ', encObj);
    // console.log('deflated = ', deflated);
    // console.log('inflated = ', inflated);
    // console.log('decoded = ', decObj);

    // var gZip = zlib.gzipSync(JSON.stringify(dataObj)).toString('base64');
    // // Calling gunzipSync method
    // var uZip = zlib.gunzipSync(new Buffer.from(
    //     gZip, 'base64')).toString('utf8');
    // console.log('gZip = ', gZip);
    // console.log('uZip = ', uZip);
    // 18.479376513644336, 73.80453348168277

    // let usrFile = dataPath + 'user_' + dataObj.email + '.txt';

    console.log("file = ", fileName);
    let opts = {
      encoding: "utf8",
      flag: "wx",
      // mode: 0o666
    };

    fs.writeFile(fileName, JSON.stringify(dataObj), opts, function (err) {
      if (err) {
        console.log("Error: writing to File");
      } else {
        console.log("User data saved");
      }
    });

    // zlib.gzip(JSON.stringify(dataObj), (err, buffer) => {
    //     console.log('gzip = ', buffer.toString('base64'));

    //     // zlib.gunzip(buffer, (err, buffer) => {
    //     //     console.log("orig = ", buffer.toString('utf8'));
    //     // });

    //     let dataStr = buffer.toString('base64');
    //     let usrFile = dataPath + dataObj.email + '.txt';

    //     console.log('fileName = ', usrFile);

    //     fs.writeFile(usrFile, dataStr, 'utf8', function (err) {
    //         if (err) {
    //             console.log('Error: writing to File');
    //         }

    //         console.log('User data saved');
    //     });

    // });

    res.redirect("/login/registerSuccess");

    // console.log('obj = ', jsonObj);
    // console.log('str = ', jsonContent);
    // console.log('str2obj = ', newObj);
    // console.log('str2obj = ', newObj);
    // console.log('str2objNew = ', newObj);

    // let newStr = JSON.stringify(newObj);

    // fs.writeFile(dataPath + 'output.json', newStr, 'utf8', function (err) {
    //     if (err) {
    //         console.log("An error occured while writing JSON Object to File.");
    //         return console.log(err);
    //     }

    //     console.log("JSON file has been saved.");
    // });

    // res.send('thank you');

    // res.send(output);

    // var data = JSON.parse(fs.readFileSync(file_name));
    // console.log('bool = ', ammUtil.isEmailValid(username));
  }
});

let output = true;
router.get("/feedbackSuccess", function (req, res) {
  if (output !== undefined) {
    res.render("about/feedbackSuccess", {
      title: "Materich Feedback",
      // area: '',
      // areaLink: '',
      // output: output
    });
  }
});

module.exports = router;
