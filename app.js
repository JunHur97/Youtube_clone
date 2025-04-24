const express = require("express");
const app = express();

const path = require("node:path");

app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "static")));

const contentNumbers = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const videoList = Array.from({ length: 16 }, () => ({
  videoSrc: "/videos/sample1.mp4",
  poster: ` /public/img/videoPage/rVideo${contentNumbers(1, 8)}.png`,
  userProfile: `/public/img/navBar/subUserIcon${contentNumbers(1, 7)}.svg`,
  description: "Lorem ipsum dolor sit amet, consecte adipiscing elit.",
  username: "James Gouse",
  views: "15K views 1 week ago",
  runningTime: "23:45",
}));

app.get("/", (req, res) => {
  res.render("main", { videoList });
});

app.get("/video", (req, res) => {
  res.render("videoPage");
});

app.listen(3000, () => {
  console.log("hos server opened");
});
