// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const fs = require("fs");
// const cors = require('cors')
const path = require("path");
//const https = require("https");
//const mysql = require("mysql");
const express = require("express");
const router = express.Router();
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
//const sessions = require("express-session");
//const ammForm = require("./code/js/utilsForm");
// const ammUtil = require('./code/js/ammUtility');

const ammFileIO = require("./code/js/ammFileIO");
const ammObj = require("./code/js/ammObj.js");
const { bash } = require("./code/js/ammBashColors.js");
const middlewareError = require("./code/js/middlewareError");

const port = process.env.PORT || 5000;
//const host = "localhost" || console.log(`App Path: ${__dirname}`);
const host = "192.168.43.238";

// global.appRoot = path.resolve(__dirname);

var app = express();

// support parsing of application/json type post data
app.use(express.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(express.urlencoded({ extended: true }));

// app.use(cors());
app.use(cookieParser());

// const oneDay = 1000 * 60 * 60 * 24;
// app.use(
//   sessions({
//     secret: "thisIsMySecrcteKeyToLoginToUserSessionOn20211111",
//     saveUninitialized: true,
//     cookie: {
//       maxAge: oneDay,
//       secure: true,
//       sameSite: "none",
//     },
//     resave: false,
//   })
// );

// a variable to save a session
//var session;

// Enable All CORS Requests
// app.use(cors())

// Enable CORS for a Single Route
// app.get('/products/:id', cors(), function (req, res, next) {
//     res.json({ msg: 'This is CORS-enabled for a Single Route' })
// })

app.use("/", express.static(path.join(__dirname, "public")));

// console.log(path.join(__dirname, 'public', 'media', 'ico', 'bap.ico'))
// Register `hbs` as our view engine using its bound `engine()` function.

// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');

// fs.readFile("test.txt", function (err, data) {
// if (err) throw err;
//     console.log(data);
// console.log(data.toString());
// });

// // Async:
// fs.readFile('test.txt', 'utf8', callback);

// // Sync:
// var content = fs.readFileSync('test.txt', 'utf8');

// Synchronous Write
// fs.writeFileSync(file, data[, options])
// fs.writeFileSync("foo.txt", "bar");

// Asynchronous Write
// fs.writeFile(file, data[, options], callback)
// fs.writeFile('foo.txt', 'bar', (err) => { if (err) throw err; });

// const stream = fs.createWriteStream('./test.txt');
// stream.write("Example text");

// if file doesn't exist create or if exists then append
// for (let i=0; i<10; i++){
//     fs.appendFileSync("junk.csv", "Line:"+i+"\n");
// }

// fs.appendFile('myFile.txt', 'Hi Ali!', function (err) {
//     if (err) throw err;
//     console.log('Thanks, It\'s saved to the file!');
// });

const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  defaultLayout: "main",
  extname: ".hbs",

  // Create Custom Helpers

  //  Chain Helpers
  // {{ helper1(helper2 text) }}
  // {{#helper1}}{{helper2}}content{{/helper2}}{{/helper1}}
  // {{url (concat 'samples/' this.name '/' this.class '/' this.id)}}

  helpers: {
    calculation: function (value) {
      return value * 10;
    },
    list: function (value, options) {
      let out = "<ul>";
      for (let i = 0; i < value.length; i++) {
        out = out + "<li>" + options.fn(value[i]) + "</li>";
      }
      return out + "</ul>";
    },
    pos: function (value, options) {
      return value + 28;
      // return options.name;
    },
    isEqual: function (v1, v2) {
      if (v1 === v2) {
        return true;
      }
      return false;
    },
    isGreaterThan: function (v1, v2) {
      if (v1 > v2) {
        return true;
      }
      return false;
    },
    isGreaterThanEqual: function (v1, v2) {
      if (v1 >= v2) {
        return true;
      }
      return false;
    },
    isLessThan: function (v1, v2) {
      if (v1 < v2) {
        return true;
      }
      return false;
    },
    isLessThanEqual: function (v1, v2) {
      if (v1 <= v2) {
        return true;
      }
      return false;
    },
    isEqualO: function (v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },

    isEven: function (val) {
      if (val % 2 == 0) {
        return true;
      }
      return false;
    },
    isEvenO: function (conditional, options) {
      if (conditional % 2 == 0) {
        return options.fn(this);
      }
      return options.inverse(this);
    },

    concat: function () {
      // let str = ''
      // for (let i = 0; i < arguments.length - 1; i++) {
      //     str += arguments[i];
      // }
      // return str;

      // console.log('hihihiii  =', arguments.length);

      let str = [...arguments].slice(0, -1);
      return str.join("");
    },
  },
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// app.get('/', function (req, res) {
//     res.render('home', {
//         title: 'Materich Home',
//         // area: 'Health',
//         // areaLink: '/health'
//     });
// });

// const data = require("./data/json/home.js");
// amm.jsonToCsv(data, './data/csv/aaa.csv');

// const imgs = require("./data/json/images.js");

// console.log(Object.keys(data).toString());
// console.log(Object.values(data));

// let file = './data/xls/website.xlsx';
// let page = 'images'
// xlsToJson(file, page)

// const data = require("./data/json/home.js");
// let fileXls = 'data/xls/website.xlsx';
// let worksheet = 'home1';
// ammFileIO.objToXls(fileXls, worksheet, data, console.log);

// let file = './data/xls/fonts_and_layout.xlsx';
// let page = 'unicode'
// let data = amm.xlsToJson(file, page, [0, 3])

// console.log('hi key = ', Object.keys(data[0]))

// http://localhost:port/?map=
app.get("/", function (req, res) {
  // const data = require("./data/json/home.js");
  const fileXls = "data/xls/website.xlsx";
  const worksheet = "home";
  const data = ammFileIO.xlsToJson(fileXls, worksheet, ".");
  // // console.log('data => ', data);

  // console.log("data => ", data[0].image);

  let hbsFile = "pageSplash";
  // let hbsFile = 'homeOld';

  if (req.query.map) {
    if (req.query.map[0] === "/") {
      res.redirect(req.query.map);
    } else {
      hbsFile = "/" + req.query.map;
    }
  }

  res.render(hbsFile, {
    title: "Home",
    // area: 'Health',
    // areaLink: '/health',
    data,
    // dataStr: JSON.stringify(data),
  });
});

// app.use('/', router)
// const loginRoute = require('./routes/login');
// router.use('/login', loginRoute);

//app.use("/", router);
//const routeLogin = require("./routes/login");
//router.use("/login", routeLogin);

//const routeAbout = require("./routes/about");
//router.use("/about", routeAbout);

//const routeTeam = require("./routes/team");
//router.use("/team", routeTeam);

//const routePublications = require("./routes/publications");
//router.use("/publications", routePublications);

// app.get('/login', function (req, res) {
//     res.render('login', {
//         title: 'Materich Home',
//         // area: 'Health',
//         // areaLink: '/health'
//     });
// });

// app.get('/look', function (req, res) {

//     res.render('lookup', {
//         title: 'I Look Up Object',
//         isTrue: true,
//         markUp: '<strong> Hi Amit </strong>',
//         user: {
//             name: 'Amit',
//             phone: '1234',
//             address: 'Pune'
//         },
//         people: [
//             'name 1',
//             'Name 2',
//             'name 3'
//         ],

//         members: [
//             { firstName: "memberFirst 1", lastName: "memberLast 1" },
//             { firstName: "memberFirst 2", lastName: "memberLast 2" },
//             { firstName: "memberFirst 3", lastName: "memberLast 3" }
//         ],

//         author: {
//             firstName: 'Amit', lastName: 'Manthanwar',
//             project: {
//                 name: 'Project Node JS'
//             }
//         }

//     })
// })

// let abtStr = '\<h2\>Hello World HOME!!!\</h2\>';

// app.get('/about', function (req, res) {
//     res.render('about', {
//         title: 'About Page',
//         area: 'Water',
//         abtStr: abtStr
//     });
// });

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

// app.get("/kanban", function (req, res) {
//   res.sendFile(path.join(__dirname, "/code/html/Kanban.html"));
// });

// app.get("/kan", function (req, res) {
//   // res.sendFile(path.join(__dirname, '/code/html/Kanban.html'));

//   let filePath = path.join(__dirname, "/code/html/Kanban.html");

//   let extName = path.extname(filePath);
//   let contentType = "text/html";

//   switch (extName) {
//     case ".css":
//       contentType = "text/css";
//       break;
//     case ".js":
//       contentType = "text/javascript";
//       break;
//     case ".json":
//       contentType = "application/json";
//       break;
//     case ".png":
//       contentType = "image/png";
//       break;
//     case ".jpg":
//       contentType = "image/jpg";
//       break;
//   }

//   console.log(`File path: ${filePath}`);
//   console.log(`Content-Type: ${contentType}`);

//   res.writeHead(200, { "Content-Type": contentType });

//   const readStream = fs.createReadStream(filePath);
//   readStream.pipe(res);
// });

// app.use('/aaa', router)
// app.use('/', router)

// router.get('/bbb', (req, res) => {
//     res.send('<h1> Hello World! from Router </h1>')
// })

// Different Layouts
// router.get('/mmm', function (req, res) {
//     res.render('home', { layout: 'main' });
// });
// router.get('/bbb', function (req, res) {
//     res.render('home', { layout: 'backend' });
// });

// const routeMaya = require('./routes/maya');
// app.use('/maya', routeMaya);

// const routeUpload = require('./routes/upload');
// app.use('/upload', routeUpload);

// router.get('/art/maya', function (req, res) {
//     res.render('home', { layout: 'layoutMaya' });
// });

// router.get('/art/aboutMaya', function (req, res) {
//     res.render('./maya/aboutMaya', { layout: 'layoutMaya' });
// });

// router.get('/data', function (req, res) {
//     res.render('formPost', { layout: 'backend' });
// });

// router.use(express.json());
// router.use(express.urlencoded({ extended: true }));

// router.post('/data', function (req, res, next) {
//     console.log("reqIP = ", (JSON.parse(req.body.ipUser)))
//     console.log("reqIP = ", (JSON.parse(req.body.weather)))
//     // console.dir(req.body)
//     // console.log("ip = ", req.ip)
//     // console.log([1, 2, 3, 4])
//     // console.dir([1, 2, 3, 4])
//     // res.send('welcome, ' + req.body.firstName)
//     res.json({ body: req.body, weather: JSON.parse(req.body.weather) })
//     // res.json({ body: JSON.parse(req.body.weather) })
//     // res.render('formPost', { layout: 'main' });
// });

// router.get('/web', function (req, res) {

//     let url = "https://api.db-ip.com/v2/free/self";
//     let userIP = ammUtil.getUrlAsJSON(url);
//     console.log('JSON Data = ', userIP)
//     res.json(userIP);

// })

app.get("*", (req, res) => {
  // res.send('Error: HTTP 404 Page Not Found');

  // res.write('<b>Error:</b> HTTP 404 Page Not Found');
  // res.write("bar");
  // res.end();
  // res.sendFile(path.join(__dirname, '/code/html/Kanban.html'));

  res.render("error/error404", {
    title: "Error HTTP 404",
    // area: 'asa',
    // abtStr: abtStr
  });
});

app.get("/error", (req, res) => {
  res.send("Custom error landing page.");
});

app.use(middlewareError.error);

app.listen(port, () => {
  //console.log(`App listening at http://localhost:${port}`);
  console.log(`App listening at http://${host}`);
});
