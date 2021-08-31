const http = require('http');
const fs = require('fs');
const path = require('path');
const TempTracker = require('./TempTracker');

http.createServer(async (req, res) => {
    let tempsTable = await fs.promises.readFile(path.resolve("database/temps.json"), 'utf-8');
    tempsTable = JSON.parse(tempsTable)
    const tempTracker = new TempTracker(tempsTable);

    if(req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream(path.resolve("public/index.html")).pipe(res);
    }

    else if(req.url === '/style.css') {
        res.writeHead(200, {'Content-Type': 'text/css'});
        fs.createReadStream(path.resolve("public/style.css")).pipe(res);
    }

    else if (req.url === '/add-temp' && req.method === "POST") {
        let data = "";
        req.on('data', (info) => {
            data += info;
        });
        req.on('end', () => {
            data = JSON.parse(data);

            fs.writeFile(path.resolve("database/temps.json"), JSON.stringify(tempTracker.add(data.temp)), (err) => {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ error: "err add database" }));
                }
                else {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ success: true }));
                }
            });            
        })
    }

    else if (req.url === "/min-temp" && req.method === "GET") {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ min: tempTracker.getMinTemp() }))
    }

    else if (req.url === "/max-temp" && req.method === "GET") {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ max: tempTracker.getMaxTemp() }))
    }

    else if (req.url === "/avg-temp" && req.method === "GET") {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ avg: tempTracker.getAvgTemp() }))
    }

    else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('not found');
    }
}).listen(3000)