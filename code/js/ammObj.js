"use strict;";

exports.sortObj = function (obj) {
  return Object.keys(obj)
    .sort()
    .reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {});
};

exports.sortByKey = function (array, key, order = "asc") {
  return array.sort((a, b) => {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    let x = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    let y = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    if (order === "asc" || order === 1) {
      return x < y ? -1 : x > y ? 1 : 0;
    } else {
      return x < y ? 1 : x > y ? -1 : 0;
    }
  });
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// Below are some good test cases:

// console.log(isNumeric(12345678912345678912)); // true
// console.log(isNumeric('2 '));                 // true
// console.log(isNumeric('-32.2 '));             // true
// console.log(isNumeric(-32.2));                // true

// // the accepted answer fails at these tests:
// console.log(isNumeric(undefined));            // false
// console.log(isNumeric(''));                   // false
// console.log(isNumeric(null));                 // false
// console.log(isNumeric([]));                   // false
