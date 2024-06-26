const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../database/database");

router.use(express.static("public"));
router.use(express.urlencoded({ extended: true }));

router.use(async (req, res, next) => {
  req.db = req.db || (await connectToDatabase());
  next();
});

function renderEditOrDelete(req, res, templateName) {
  req.db
    .collection("CurrentWork")
    .find({})
    .toArray()
    .then((data) => {
      let k = data;
      let c = k[0].i;
      if (c <= k.length) {
        res.render(templateName, { work: k[c] });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

router.get("/", (req, res) => {
  res.render("index");
});

// router.get("/todo1", async (req, res) => {
//   try {
//     const data = await req.db.collection("CurrentWork").find({}).toArray();
//     if (data.length === 0) {
//       console.error("No data found");
//       res.status(404).send("Not Found");
//       return;
//     }

//     let currentIndex = data[0].i;
//     let nextIndex = (currentIndex % data.length) + 1;

//     await req.db
//       .collection("CurrentWork")
//       .updateOne({ i: currentIndex }, { $set: { i: nextIndex } });

//     res.json(data[nextIndex - 1]);
//     console.log(data[nextIndex - 1]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

router.get("/todo", async (req, res) => {
  try {
    const data = await req.db.collection("CurrentWork").find({}).toArray();
    if (data.length === 0) {
      console.error("No data found");
      res.status(404).send("Not Found");
      return;
    }
    let currentIndex = data[0].i;
    res.render("todo", { work: data[currentIndex] });
    console.log(data[currentIndex]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/prev", async (req, res) => {
  try {
    const data = await req.db.collection("CurrentWork").find({}).toArray();
    if (data.length === 0) {
      console.error("No data found");
      res.status(404).send("Not Found");
      return;
    }

    let currentIndex = data[0].i;
    let prevIndex = (currentIndex - 1) % data.length;
    if (prevIndex === 0) {
      prevIndex = data.length - 1;
    }
    await req.db
      .collection("CurrentWork")
      .updateOne({ i: currentIndex }, { $set: { i: prevIndex } });

    res.render("todo", { work: data[prevIndex] });
    console.log(data[prevIndex]);
    //console.log(prevIndex);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/add", (req, res) => {
  res.render("add");
});
router.get("/edit", (req, res) => {
  renderEditOrDelete(req, res, "edit");
});

router.post("/editLink", async (req, res) => {
  try {
    const { Title, Link, Description } = req.body;
    if (!Title || !Link || !Description) {
      return res.status(400).send("Missing required fields.");
    }
    await req.db
      .collection("CurrentWork")
      .updateOne(
        { Title: Title },
        { $set: { Link: Link, Description: Description } }
      );
    console.log("Data edited successfully");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/submit", (req, res) => {
  let Title = req.body.Title;
  let Description = req.body.Description;
  let Link = req.body.Link;
  let data = { Title: Title, Description: Description, Link: Link };
  req.db
    .collection("Work")
    .insertOne(data)
    .then(() => {
      console.log("data inserted");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/delete", (req, res) => {
  renderEditOrDelete(req, res, "delete");
});
router.post("/deleteLink", (req, res) => {
  req.db
    .collection("Work")
    .deleteOne({ Title: req.body.Title })
    .then(() => {
      console.log("data deleted from work");
      req.db
        .collection("WorkDone")
        .insertOne({
          Title: req.body.Title,
          Description: req.body.Description,
          Link: req.body.Link,
        })
        .then(() => {
          console.log("data inserted in WorkDone");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  req.db
    .collection("CurrentWork")
    .deleteOne({ Title: req.body.Title })
    .then(() => {
      req.db
        .collection("Work")
        .find({})
        .toArray()
        .then((data) => {
          if (data.length === 0) {
            console.error("No data found");
            res.status(404).send("Not Found");
            return;
          }

          let currentIndex = data[0].i;
          let nextIndex = (currentIndex % data.length) + 1;
          let ndata = {
            Title: data[currentIndex].Title,
            Description: data[currentIndex].Description,
            Link: data[currentIndex].Link,
          };
          req.db
            .collection("CurrentWork")
            .insertOne(ndata)
            .then(() => {
              console.log("data inserted");
              //console.log(ndata);
            })
            .catch((err) => {
              console.log(err);
            });
          req.db
            .collection("Work")
            .updateOne({ i: currentIndex }, { $set: { i: nextIndex } });
          res.redirect("/");
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/afterSomeTime", (req, res) => {
  req.db
    .collection("Work")
    .deleteOne({ Title: req.body.Title })
    .then(() => {
      console.log("data deleted from Work");
      req.db
        .collection("AfterSomeTime")
        .insertOne({
          Title: req.body.Title,
          Description: req.body.Description,
          Link: req.body.Link,
        })
        .then(() => {
          console.log("data inserted in AfterSomeTime");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  req.db
    .collection("CurrentWork")
    .deleteOne({ Title: req.body.Title })
    .then(() => {
      console.log("data deleted from CurrentWork");
      req.db
        .collection("Work")
        .find({})
        .toArray()
        .then((data) => {
          if (data.length === 0) {
            console.error("No data found");
            res.status(404).send("Not Found");
            return;
          }

          let currentIndex = data[0].i;
          let nextIndex = (currentIndex % data.length) + 1;
          let ndata = {
            Title: data[currentIndex].Title,
            Description: data[currentIndex].Description,
            Link: data[currentIndex].Link,
          };
          req.db
            .collection("CurrentWork")
            .insertOne(ndata)
            .then(() => {
              console.log("data inserted");
              //console.log(ndata);
            })
            .catch((err) => {
              console.log(err);
            });
          req.db
            .collection("Work")
            .updateOne({ i: currentIndex }, { $set: { i: nextIndex } });
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

router.get("/next", async (req, res) => {
  try {
    const data = await req.db.collection("CurrentWork").find({}).toArray();
    if (data.length === 0) {
      console.error("No data found");
      res.status(404).send("Not Found");
      return;
    }
    let currentIndex = data[0].i;
    let nextIndex = (currentIndex + 1) % data.length;
    if (nextIndex === 0) {
      nextIndex = nextIndex + 1;
    }
    await req.db
      .collection("CurrentWork")
      .updateOne({ i: currentIndex }, { $set: { i: nextIndex } });
    res.render("todo", { work: data[nextIndex] });
    console.log(data[nextIndex]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/all", (req, res) => {
  req.db
    .collection("Work")
    .find({})
    .toArray()
    .then((data) => {
      res.render("all", { work: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
