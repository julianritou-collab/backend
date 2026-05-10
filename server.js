const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Voilà la réponse du serveur Mon Vieux Grimoire !');
});

server.listen(process.env.PORT || 3000);