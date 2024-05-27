const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const cors = require("cors");
app.use(cors({
    origin: '*'
}));


app.get("/", (req, res) => res.type('html').send(html));

app.get("/player/:name/seasonStats", async (req, res) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `8164e6c8-9e68-4c31-929c-1872397034da`  // Replace with your actual API key
        }
    };
    const headers = {'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'}
    //TODO: limit player info result to 1 (loop through data removing based an anything null)
    let playerInfo = await fetch("https://api.balldontlie.io/v1/players?search="+req.params.name, requestOptions);
    let playerInfoJson = await playerInfo.json();
    console.log(playerInfoJson)
    try {
        let playerID = playerInfoJson.data[0].id;

        const playerSeasonStatsReq = await fetch("https://api.balldontlie.io/v1/season_averages?season=2023&player_ids[]=" + playerID, requestOptions);
        const playerSeasonStats = await playerSeasonStatsReq.json();
        //console.log(JSON.stringify(playerSeasonStats).substring(0,JSON.stringify(playerSeasonStats).indexOf('}')+1))
        //console.log('\n\n\n')
        let indexHelperInfo = JSON.stringify(playerInfoJson.data[0]);
        let indexHelperStats = JSON.stringify(playerSeasonStats.data[0]);

        res.write("{\"" + "data" + "\": [" + indexHelperInfo.substring(0, indexHelperInfo.length - 1) + ", " + indexHelperStats.substring(1) + "]}");
    }
    catch (error) {
        res.write("{\"" + "data" + "\": [{" +"\"first_name\": \"No Player Found\"" + "}]}");
    }
    const response = {
        statusCode: 200,
        headers:headers,
        body: res.end(),
    };
    return response;
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
