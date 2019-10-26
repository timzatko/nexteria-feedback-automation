const express = require("express");
const request = require("request");
const cheerio = require("cheerio");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.post("/", function(req, resp) {
  const method = req.body.method || "4gram";
  const text = req.body.text || "";

  function resSend(obj) {
    resp.send(JSON.stringify(obj));
  }

  request.post(
    { url: "https://diakritik.juls.savba.sk/#", form: { text, method } },
    (err, resp, body) => {
      if (err) {
        console.error(err);

        resSend({ error: err.toString() });
      }

      const $ = cheerio.load(body);
      const text = $(".rec > .recinside").text();

      resSend({ text });
    }
  );
});

app.listen(6060);
