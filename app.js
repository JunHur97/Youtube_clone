const express = require("express");
const app = express();

const path = require("node:path");

app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "static")));

const videoList = [
  {
    videoSrc: "/videos/sample1.mp4",
    poster: " /public/img/videoPage/rVideo1.png",
    userProfile: "/public/img/navBar/subUserIcon1.svg",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit.",
    username: "James Gouse",
    views: "15K views 1 week ago",
    runningTime: "23:45",
  },
  {
    videoSrc: "/videos/sample1.mp4",
    poster: " /public/img/videoPage/rVideo2.png",
    userProfile: "/public/img/navBar/subUserIcon2.svg",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit.",
    username: "James Gouse",
    views: "15K views 1 week ago",
    runningTime: "23:45",
  },
  {
    videoSrc: "/videos/sample1.mp4",
    poster: " /public/img/videoPage/rVideo3.png",
    userProfile: "/public/img/navBar/subUserIcon3.svg",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit.",
    username: "James Gouse",
    views: "15K views 1 week ago",
    runningTime: "23:45",
  },
  {
    videoSrc: "/videos/sample1.mp4",
    poster: " /public/img/videoPage/rVideo4.png",
    userProfile: "/public/img/navBar/subUserIcon4.svg",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit.",
    username: "James Gouse",
    views: "15K views 1 week ago",
    runningTime: "23:45",
  },
  {
    videoSrc: "/videos/sample1.mp4",
    poster: " /public/img/videoPage/rVideo5.png",
    userProfile: "/public/img/navBar/subUserIcon5.svg",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit.",
    username: "James Gouse",
    views: "15K views 1 week ago",
    runningTime: "23:45",
  },
  {
    videoSrc: "/videos/sample1.mp4",
    poster: " /public/img/videoPage/rVideo6.png",
    userProfile: "/public/img/navBar/subUserIcon6.svg",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit.",
    username: "James Gouse",
    views: "15K views 1 week ago",
    runningTime: "23:45",
  },
  {
    videoSrc: "/videos/sample1.mp4",
    poster: " /public/img/videoPage/rVideo7.png",
    userProfile: "/public/img/navBar/subUserIcon7.svg",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit.",
    username: "James Gouse",
    views: "15K views 1 week ago",
    runningTime: "23:45",
  },
  {
    videoSrc: "/videos/sample1.mp4",
    poster: " /public/img/videoPage/rVideo8.png",
    userProfile: "/public/img/navBar/subUserIcon1.svg",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit.",
    username: "James Gouse",
    views: "15K views 1 week ago",
    runningTime: "23:45",
  },
  {
    videoSrc: "/videos/sample1.mp4",
    poster: " /public/img/videoPage/rVideo5.png",
    userProfile: "/public/img/navBar/subUserIcon4.svg",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit.",
    username: "James Gouse",
    views: "15K views 1 week ago",
    runningTime: "23:45",
  },
  {
    videoSrc: "/videos/sample1.mp4",
    poster: " /public/img/videoPage/rVideo6.png",
    userProfile: "/public/img/navBar/subUserIcon3.svg",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit.",
    username: "James Gouse",
    views: "15K views 1 week ago",
    runningTime: "23:45",
  },
  {
    videoSrc: "/videos/sample1.mp4",
    poster: " /public/img/videoPage/rVideo7.png",
    userProfile: "/public/img/navBar/subUserIcon2.svg",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit.",
    username: "James Gouse",
    views: "15K views 1 week ago",
    runningTime: "23:45",
  },
  {
    videoSrc: "/videos/sample1.mp4",
    poster: " /public/img/videoPage/rVideo8.png",
    userProfile: "/public/img/navBar/subUserIcon1.svg",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit.",
    username: "James Gouse",
    views: "15K views 1 week ago",
    runningTime: "23:45",
  },
];

const mainPageButton = [];
for (let i = 0; i < 20; i++) {
  mainPageButton.push({ content: i === 0 ? "All" : "Item" });
}

app.get("/", (req, res) => {
  res.render("main", { videoList, mainPageButton });
});

app.get("/video", (req, res) => {
  res.render("videoPage");
});

app.listen(3000, () => {
  console.log("hos server opened");
});

app.set("view cache", false);
