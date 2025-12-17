const express = require('express');
const app = express();



app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.get('/namaste', (req, res) => {
    res.send('Namaste!');
}); 

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});