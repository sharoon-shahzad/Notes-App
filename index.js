const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
// const filespath = path.join(__dirname, "files");

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    // handle the edge cases here
    // check the files if not console.log(no data to send) with in the if block create the files using appendFile method
    // else renaer the files present
    if (err) {
      console.log("No data to send");
    } else {
      res.render("index", { files: files });
    }
  });
});
app.get("/notes/:title", (req, res) => {
  const title = req.params.title;
  fs.readFile(`./files/${title}`, "utf8", (err, data) => {
    if (err) {
      res.status(404).send("File not found");
      console.log(err);
      return;
    }
    const doctitle = title.replace(".txt", "");
    const doclink = `https://google.com`;
    res.render("note", { title: req.params.title, details: data ,doclink:doclink});
  });
});

app.post("/create", (req, res) => {
  const title = req.body.title.split(" ").join("");
  const details = req.body.details;

  // Check if the title is empty
  if (title === "") {
    res.status(400).send("Title is required");
    return;
  }

  // Check if the details are empty
  if (details === "") {
    res.status(400).send("Details are required");
    return;
  }

  // Check if the file already exists
  fs.access(`./files/${title}.txt`, fs.constants.F_OK, (err) => {
    if (!err) {
      res.status(400).send("File already exists");
      return;
    }

    // Write the file
    fs.writeFile(`./files/${title}.txt`, details, (err) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        return;
      }

      res.redirect("/");
    });
  });
});

app.get("/edit/:title", (req, res) => {
  res.render("edit", { title: req.params.title });
});

app.post("/edit", (req, res) => {
  console.log(req.body);
  const newtitle = req.body.newtitle
  const prevtitle = req.body.previoustitle;
  console.log(newtitle);
  console.log(prevtitle);
  fs.rename( `./files/${prevtitle}`, `./files/${newtitle}`, (err) => {
    if(err){
      res.status(404).send("File not found");
      return;
    }
      res.redirect("/");
    });
  });

//deleting routes

app.get("/delete/:title",(req,res)=>
{
    res.render("delete",{title:req.params.title});
    
});
// app.post("/delete",(req,res)=>{
//     const deletefile = req.body.deletefile;
//     fs.unlink(`./files/${deletefile}`,(err)=>
//     {
//         if(err)
//         {
//             res.status(404).send("File not found");
//             return;
//         }
//     });
// })

app.post("/delete", (req, res) => {
    const deletefile = req.body.deletefile;
    fs.unlink(`./files/${deletefile}`, (err) => {
      if (err) {
        res.status(404).send("File not found");
        return;
      }
    });
    res.redirect("/");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
