const fs = require("fs");
// const fs = require('fs').promises;
const exec = require("child_process").exec;
const getDirName = require("path").dirname;
const xlsx = require("node-xlsx").default;

exports.fileWriteDir = function (path, contents, cb) {
  fs.mkdir(getDirName(path), { recursive: true }, (err) => {
    if (err) {
      cb("Error fs.mkdir: ", err);
      return;
    }

    fs.writeFile(path, contents, (err) => {
      if (err) {
        cb("Error fs.writeFile: ", err);
        return;
      }
      cb("Written successfully to", path);
    });
  });
};

exports.fileWrite = function (path, contents, cb) {
  // this.log('path = ', path);

  fs.writeFile(path, contents, (err) => {
    if (err) {
      cb("Error fs.writeFile: ", err);
      return;
    }
  });

  cb("Written successfully to", path);
};

exports.fileAppend = function (path, contents, cb) {
  fs.appendFile(path, contents, (err) => {
    if (err) {
      cb("Error fs.appendFile: ", err);
      return;
    }
  });
  cb("Appended successfully to file", path);
};

exports.fileWriteBuffer = function (path, buffer, cb) {
  // flag: 'w', 'a'
  flag = "w+";
  fs.open(path, flag, function (err, fd) {
    if (err) {
      throw "error opening file: " + err;
    }

    fs.write(fd, buffer, 0, buffer.length, null, function (err) {
      if (err) throw "error writing file: " + err;
      fs.close(fd, function () {
        console.log("file written");
      });
    });
  });
};

exports.fileRead = function (path, cb) {
  fs.readFile(path, function read(err, data) {
    if (err) {
      cb("Error fs.readFile: ", err);
      return;
    }
    // const content = data;
    // Invoke the next step here however you like
    // console.log(content);   // Put all of the code here (not the best solution)
    // processFile(content);   // Or put the next step in a function and invoke it

    // cb(JSON.parse(data));
    //
    cb(data.toString());
    // return data;
  });
  //
};

/**
 * Class the shell commands from child process
 *
 * @param {string} cmd   command
 * @param {string} cb    call back function
 */

exports.sh = function (cmd, cb) {
  let child = exec(cmd, (error, stdout, stderr) => {
    if (error !== null) {
      cb("Error exec: " + error);
      return;
    }

    cb("stdout: " + stdout);

    if (stderr) {
      cb("stderr: " + stderr);
    }
  });
};

exports.log = function (err, path) {
  if (path === undefined) {
    console.log(err);
    return;
  }
  console.log(err, path);
};

/**
 * @description converts csv string into json object
 * @since 20211203-0012
 * @author Amit M. Manthanwar
 * @param {string} csvLines
 * @returns {json} data
 */
function strToJson(csvStr) {
  const lines = csvStr.split("\n");
  const result = [];
  const headers = lines[0].split(",");

  lines.splice(0, 1);
  lines.map((l) => {
    const obj = {};
    const line = l.split(",");

    headers.map((h, i) => {
      obj[h] = line[i];
    });

    result.push(obj);
  });
  return result;
}

/**
 * @description converts csv file into json object
 * @since 20211203-0012
 * @author Amit M. Manthanwar
 * @param {string} csvLines
 * @returns {json} data
 */
function csvToJson(path, cb) {
  fileRead(path, (data) => {
    let obj = strToJson(data);
    cb(obj);
  });
}

/**
 * @description converts string of csv lines into deep nested json object
 * @since 20211203-0012
 * @author Amit M. Manthanwar
 * @param {string} csvLines
 * @returns {json} data
 */
function strToJsonNest(csvLines, separator) {
  let attrs = csvLines.splice(0, 1);

  // console.log('header = ', attrs);

  let result = csvLines.map(function (row) {
    let obj = {};
    // var rowData = row.split(',');
    let rowData = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    attrs[0].split(",").forEach(function (val, idx) {
      obj = constructObj(val, obj, rowData[idx]);
    });
    return obj;
  });

  // console.log('result = ', result[2]);

  function constructObj(str, parentObj, data) {
    if (str.split(separator).length === 1) {
      parentObj[str.trim()] = data;
      return parentObj;
    }

    let curKey = str.split(separator)[0];

    if (!parentObj[curKey]) {
      parentObj[curKey] = {};
    }

    parentObj[curKey] = constructObj(
      str.split(separator).slice(1).join(separator),
      parentObj[curKey],
      data
    );
    return parentObj;
  }

  return result;
}

function strToJsonNestSlash(csvLines) {
  let attrs = csvLines.splice(0, 1);

  let result = csvLines.map(function (row) {
    let obj = {};
    // var rowData = row.split(',');
    let rowData = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    attrs[0].split(",").forEach(function (val, idx) {
      obj = constructObj(val, obj, rowData[idx]);
    });
    return obj;
  });

  function constructObj(str, parentObj, data) {
    if (str.split("/").length === 1) {
      parentObj[str.trim()] = data;
      return parentObj;
    }

    let curKey = str.split("/")[0];

    if (!parentObj[curKey]) {
      parentObj[curKey] = {};
    }

    parentObj[curKey] = constructObj(
      str.split("/").slice(1).join("/"),
      parentObj[curKey],
      data
    );
    return parentObj;
  }

  return result;
}

/**
 * @description converts csv file into deep nested json object
 * @since 20211203-0012
 * @author Amit M. Manthanwar
 * @param {string} csvLines
 * @returns {json} data
 */
function csvToJsonNest(path, separator, cb) {
  fileRead(path, (data) => {
    let lines = data.split("\r\n");
    lines = lines.filter(Boolean);
    let obj = strToJsonNest(lines, separator);
    cb(obj);
  });
}

/**
 * @description converts simple json to csv file
 * @since 20211203-0012
 * @author Amit M. Manthanwar
 * @param {string} csvLines
 * @returns {json} data
 */
exports.jsonToCsv = function (data, file) {
  // let header = '';
  // let values = '';

  var lineArray = [];
  var csvContent;

  data.forEach((item, index) => {
    Object.entries(item).forEach(([k0, v0]) => {
      if (k0 === "image") {
        index == 0 ? lineArray.push(Object.keys(v0)) : "";

        lineArray.push(Object.values(v0));
      }
    });
  });

  csvContent = lineArray.join("\n");

  fileWrite(file, csvContent, log);
};

/**
 * @description returns the transpose of 2D array
 * @since 20211203-0157
 * @author Amit M. Manthanwar
 * @param {array2D} array
 * @returns {array2D}
 * @tutorial
 */

exports.arrTranspose = function (array) {
  return array.reduce(
    (prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])),
    []
  );
};

// // One-liner that does not change given array.
// a[0].map((col, i) => a.map(([...row]) => row[i]))

/**
 * @description returns the array of range of columns of given array
 * @since 20211203-0012
 * @author Amit M. Manthanwar
 * @param {array2D} array
 * @param {array} cols [start index, end index+1]
 * @returns {array2D}
 * @tutorial
 * getColsArray(array2D, [0, 3])
 */
exports.getColsArrayRange = function (array, cols) {
  // slice() returns selected elements in an array, as a new array.
  // slice() selects from a given start, up to a (not inclusive) given end.
  // slice() does not change the original array.
  return array.map((e) => e.slice(...cols));
};

/**
 * @description returns the sub array given column indices of given array
 * @since 20211203-0202
 * @author Amit M. Manthanwar
 * @param {array2D} array
 * @param {array} colsIdx [array of indices]
 * @returns {array2D}
 * @tutorial
 */

exports.getColsIndices = function (arr, indices) {
  return arr.map((row) => indices.map((i) => row[i]));
};

exports.getColsArrayIdxTr = function (array, colIdx) {
  let newArr = [];
  colIdx.forEach((element) => {
    newArr.push(array.map((x) => x[element]));
  });
  return exports.arrTranspose(newArr);
};

/**
 * @description reduce deep nested object to object with dotted string.
 * @since 20211207-0300
 * @author Amit M. Manthanwar
 * @param {object} obj object from which new dotted key object created
 * @returns {object}
 * @tutorial
 * let a = dotted({ 'a': { 'b1': { 'c': 1 }, 'b2': { 'c': 1 } } })
 * console.log('ans = ', aa) //{'a.b1.c':1,'a.b2.c':1}
 *
 */
function dotted(obj) {
  const res = {};
  function recurse(obj, current) {
    for (const key in obj) {
      const value = obj[key];
      if (value != undefined) {
        const newKey = current ? current + "." + key : key;
        if (value && typeof value === "object") {
          recurse(value, newKey);
        } else {
          res[newKey] = value;
        }
      }
    }
  }
  recurse(obj);
  return res;
}

/**
 * @description recompose dotted key data from deep nested object
 * @since 20211207-0300
 * @author Amit M. Manthanwar
 * @param {string} string dotted string
 * @param {object} obj object to which new object added
 * @returns {object}
 * @tutorial
 * let obj = { a: { b: '1', c: '2', d: { a: { b: 'blah' } } } };
 * console.log('Recompose = ', recompose(obj, 'a.d.a.b')); //blah

 *
 */
function recompose(obj, string) {
  var parts = string.split(".");
  var newObj = obj[parts[0]];
  if (parts[1]) {
    parts.splice(0, 1);
    var newString = parts.join(".");
    return recompose(newObj, newString);
  }
  return newObj;
}

/**
 * @description construct object from dot notation string obj.hi.
 * @since 20211207-0300
 * @author Amit M. Manthanwar
 * @param {string} str dotted string
 * @param {object} parentObj object to which new object added
 * @param {string} separator
 * @param {obj} data value of the new deep nested object
 * @returns {object}
 * @tutorial
 * str = 'a.b.c.d'
 * parentObj = {}
 * data = 'hi'
 * ans = {a:{b:{c:{d: 'hi}}}}
 */
function dottedObject(str, parentObj, data, separator = ".") {
  if (str.split(separator).length === 1) {
    parentObj[str.trim()] = data;
    return parentObj;
  }

  let curKey = str.split(separator)[0];

  if (!parentObj[curKey]) {
    parentObj[curKey] = {};
  }

  parentObj[curKey] = dottedObject(
    str.split(separator).slice(1).join(separator),
    parentObj[curKey],
    data
  );
  return parentObj;
}

/**
 * @description returns the json object from excel worksheet
 * @since 20211203-0202
 * @author Amit M. Manthanwar
 * @param {string} file file path
 * @param {string} worksheet name fo the worksheet
 * @returns {object}
 */
exports.xlsToJson = function (file, worksheet, separator = ".") {
  // const xlsx = require('node-xlsx').default;

  const xls = xlsx.parse(file);

  let ws = xls.find((obj) => {
    return obj.name === worksheet;
  });

  let keys = ws.data[0];

  let newObjArr = [];
  for (let i = 1, n = ws.data.length; i < n; i++) {
    let newObj = {};
    for (let j = 0; j < keys.length; j++) {
      dottedObject(keys[j], newObj, ws.data[i][j]);
    }
    newObjArr.push(newObj);
  }

  return newObjArr;
};

/**
 * @description returns the json object from excel worksheet given column range
 * @since 20211203-0202
 * @author Amit M. Manthanwar
 * @param {string} file file path
 * @param {string} worksheet name fo the worksheet
 * @param {array} cols [starting idex, ending column index + 1]
 * @param {function} cb callback function
 * @returns {object}
 */
exports.xlsToJsonXlsRange = function (file, worksheet, separator, cols, cb) {
  // const xlsx = require('node-xlsx').default;

  // const xls = xlsx.parse('./data/xls/website.xlsx');
  const xls = xlsx.parse(file);

  // log(xls[0])

  let ws = xls.find((obj) => {
    // return obj.name === 'images'
    return obj.name === worksheet;
  });

  let wsCols = exports.getColsArrayRange(ws.data, cols);

  // log('ws = ', wsCols)
  // log(wsCols.join('\r\n'))

  let csvStr = wsCols.join("\r\n");
  let lines = csvStr.split("\r\n");
  let newJson = strToJsonNest(lines, separator);

  // log(newJson[2])

  return newJson;
};

/**
 * @description returns json object from excel worksheet given column indices
 * @since 20211203-0202
 * @author Amit M. Manthanwar
 * @param {string} file file path
 * @param {string} worksheet name fo the worksheet
 * @param {array} colsIdx [array of column indices]
 * @param {function} cb callback function
 * @returns {object}
 */
exports.xlsToJsonXlsCols = function (file, worksheet, colsIdx, separator, cb) {
  // const xlsx = require('node-xlsx').default;

  // const xls = xlsx.parse('./data/xls/website.xlsx');
  const xls = xlsx.parse(file);

  // log(xls[0])

  let ws = xls.find((obj) => {
    // return obj.name === 'images'
    return obj.name === worksheet;
  });

  let wsCols = exports.getColsIndices(ws.data, colsIdx);

  // log('ws = ', wsCols)
  // log(wsCols.join('\r\n'))

  let csvStr = wsCols.join("\r\n");
  let lines = csvStr.split("\r\n");
  let newJson = strToJsonNest(lines, separator);

  // log(newJson[2])

  return newJson;
};

exports.getTimeStamp = function () {
  const date = new Date();
  const timeStamp =
    date.getFullYear().toString() +
    date.getMonth().toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0") +
    "-" +
    date.getHours().toString().padStart(2, "0") +
    date.getMinutes().toString().padStart(2, "0") +
    date.getSeconds().toString().padStart(2, "0");
  return timeStamp;
};

/**
 * @description check if file exists
 * @since 20211206-2143
 * @author Amit M. Manthanwar
 * @param {string} file file path
 * @returns {bool} true or false
 */
exports.fileExists = function (file) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

/**
 * @description writes excel worksheet given 2D array data
 * @since 20211203-0202
 * @author Amit M. Manthanwar
 * @param {string} file file path
 * @param {string} worksheet name fo the worksheet
 * @param {array2D} data [2D array data]
 * @param {function} cb callback function
 * @returns {file} writes .xls file
 */
exports.arrayToXls = function (file, worksheet, data, cb) {
  let buffer;

  if (exports.fileExists(file)) {
    const xls = xlsx.parse(file);

    console.log(xls);

    let indexExists = 0;
    let sheetExists = xls.some(function (element, idx) {
      if (element.name === worksheet) {
        indexExists = idx + 1;
        worksheet = worksheet + "-" + exports.getTimeStamp();
        return true;
      }
    });

    console.log("exists = ", file, worksheet, sheetExists, indexExists);

    xls.splice(indexExists, 0, { name: worksheet, data: data });
    buffer = xlsx.build(xls);
  } else {
    buffer = xlsx.build([{ name: worksheet, data: data }]);
  }

  exports.fileWriteBuffer(file, buffer);
  cb("data written successfully to file\n", file);
};

/**
 * @description writes many excel worksheets given object array of data
 * @since 20211203-0202
 * @author Amit M. Manthanwar
 * @param {string} file file path
 * @param {oject} data [array of object]
 * @param {function} cb callback function
 * @returns {file} writes .xls file
 * @tutorial
 * data = [{name: 'ws1', data: obj1}, {name: 'ws2', data: obj2}]
 * data = {
 *      { name: "mySheet1", data: [2D data Array 1] },
 *      { name: "mySheet2", data: [2D data Array 2] },
 *      { name: "mySheet3", data: [2D data Array 3], options: sheetOptions }
 * };
 *
 */
exports.jsonArrayToXlsMany = function (file, data, cb) {
  // const xlsx = require('node-xlsx').default;

  // const dataSheet1 = [
  //     [1, 2, 3],
  //     [true, false, null, 'sheet-js'],
  //     ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
  //     ['baz', null, 'qux']
  // ];
  // const dataSheet2 = [
  //     [4, 5, 6],
  //     [7, 8, 9, 10],
  //     [11, 12, 13, 14],
  //     ['baz', null, 'qux']
  // ];

  // const range = { s: { c: 0, r: 0 }, e: { c: 0, r: 3 } }; // A1:A4
  // const sheetOptions = { '!merges': [range] };
  // var buffer = xlsx.build([
  //     { name: "myFirstSheet", data: dataSheet1 },
  //     { name: "mySecondSheet", data: dataSheet2 },
  //     { name: "mySecondSheet2", data: dataSheet2, options: sheetOptions }
  // ]); // Returns a buffer

  let buffer = xlsx.build(data);

  fileWriteBuffer(file, buffer);
  cb("data written successfully to file\n", file);
};

/**
 * @description converts deep nested object to 2D array
 * @since 20211203-0231
 * @author Amit M. Manthanwar
 * @param {oject} jsonArray [array of deep nested object]
 * @param {function} cb callback function
 * @returns {array2D}
 */
function jsonDeepToArray(jsonArray, cb) {
  let mp = new Map();

  function setValue(a, path, val) {
    if (Object(val) !== val) {
      // primitive value
      var headerStr = path.join(".");
      var i = (mp.has(headerStr) ? mp : mp.set(headerStr, mp.size)).get(
        headerStr
      );
      a[i] = val;
    } else if (exports.isArray(val) && exports.isObject(val)) {
      val.forEach((element, index) => {
        for (var key in element) {
          setValue(
            a,
            key == "0" ? path : path.concat(index, key),
            element[key]
          );
        }
      });
    } else {
      for (var key in val) {
        if (exports.isArray(val)) {
          setValue(
            a,
            key == "0" ? path.concat("0") : path.concat(key),
            val[key]
          );
        } else {
          setValue(a, key == "0" ? path : path.concat(key), val[key]);
        }
      }
    }
    return a;
  }

  var result = jsonArray.map((obj) => setValue([], [], obj));

  return [[...mp.keys()], ...result];
}

/**
 * @description converts 2D array converted from function jsonDeepToArray
 * @since 20211203-0231
 * @author Amit M. Manthanwar
 * @param {array2D} array2D [2D array converted from deep nested object]
 * @returns {string} string of lines
 */
function arrayToCsv(array2D) {
  return array2D
    .map((row) =>
      row.map((val) => (isNaN(val) ? JSON.stringify(val) : +val)).join(",")
    )
    .join("\n");
}

/**
 * @description converts deep nested object to csv string
 * @since 20211203-0231
 * @author Amit M. Manthanwar
 * @param {oject} objArray [array of deep nested object]
 * @returns {string}
 */
exports.objToCsvStr = function (objArray) {
  return arrayToCsv(jsonDeepToArray(objArray));
};

/**
 * @description writes csv file fo converted deep nested object array
 * @since 20211203-0231
 * @author Amit M. Manthanwar
 * @param {string} file file path
 * @param {oject} objArray [array of deep nested object]
 * @param {function} callback
 * @returns {file} writes a csv file
 */
exports.jsonToCsv = function (file, objArray, callback) {
  let data = exports.objToCsvStr(objArray);
  exports.fileWrite(file, data, callback);
};

/**
 * @description write xls file by converting deep nested object array
 * @since 20211203-0231
 * @author Amit M. Manthanwar
 * @param {string} file file path
 * @param {string} worksheet name of worksheet
 * @param {oject} objArray [array of deep nested object]
 * @param {function} callback
 * @returns {file} writes an xlsx file
 */
exports.objToXls = function (file, worksheet, objArray, callback) {
  let dataArr2D = jsonDeepToArray(objArray);
  exports.arrayToXls(file, worksheet, dataArr2D, callback);
};

// exports.jsonToArr2D(childFieldNames, cb){
//     var ary2D = Object.keys(childFieldNames).map(function (key) {
//         return childFieldNames[key];
//     });
// }

// for (const [key, value] of Object.entries(object)) {
//     value.forEach(v => {
//         console.log(`${key}: ${v}`);
//     })
// }

exports.isPrimitive = function (val) {
  if (val === Object(val)) {
    return false;
  } else {
    return true;
  }
};

// isPrimitive(null)                            // true
// isPrimitive(12)                              // true
// isPrimitive(Number(12))                      // true
// isPrimitive("Hello world")                   // true
// isPrimitive(new String("Hello world"))       // false
// isPrimitive(true)                            // true
// isPrimitive([])                              // false
// isPrimitive({})                              // false

exports.isArray = function (val) {
  return !!val && val.constructor === Array;
};
// Result:
// console.log(isArray(        )); // false
// console.log(isArray(    null)); // false
// console.log(isArray(    true)); // false
// console.log(isArray(       1)); // false
// console.log(isArray(   'str')); // false
// console.log(isArray(      {})); // false
// console.log(isArray(new Date)); // false
// console.log(isArray(      [])); // true

exports.isObject = function (val) {
  return !!val && val.constructor === Object;
};
// Result:
// console.log(isObject(        )); // false
// console.log(isObject(    null)); // false
// console.log(isObject(    true)); // false
// console.log(isObject(       1)); // false
// console.log(isObject(   'str')); // false
// console.log(isObject(      [])); // false
// console.log(isObject(new Date)); // false
// console.log(isObject(      {})); // true

/**
 * @description Simple object that return 2D array
 * @author Amit M> Manthanwar
 * @since 20211207-0413
 * @param {object} object simple object to convert into 2D array
 * @returns 2D array
 */
exports.objToArray2D = function (object) {
  let newArray = [];
  for (const [key, value] of Object.entries(object)) {
    newArray.push(Object.values(value));
  }
  return newArray;
};
