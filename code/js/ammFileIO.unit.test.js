"use strict";

const fs = require("fs");
const path = require("path");

const ammFileIO = require("./ammFileIO.js");

const fileXls = "data/xls/website.xlsx";
const worksheet = "home";
const data = ammFileIO.xlsToJson(fileXls, worksheet, ".");
// // console.log('data => ', data);

// console.log("data => ", data);

const result = {
  click: "",
  id: 5,
  image: {
    about: "",
    brief: undefined,
    id: 5,
    linkM: "https://pixabay.com/users/absolutvision-6158753/",
    linkO: "https://pixabay.com/images/id-2651346/",
    maker: "Gino Crescoli",
    owner: "Pixabay",
    place: "media/jpg/",
    privy: undefined,
    style: "",
    title: "business-g269faef7d_1920.jpg",
  },
  notes: "Here you can find a list of articles, publications and patents.",
  refer: "/publications",
  title: "Publications",
};

test("test object strict equality", () => {
  //   expect(data[4].title).toBe("Publications");
  expect(data[4]).toEqual(result);
});

// console.log(data[4].title);
