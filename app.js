const express = require('express');
const app = express();

app.use((req, res) => {
    res.send('Voilà la réponse du serveur Mon Vieux Grimoire !');
});

module.exports = app;