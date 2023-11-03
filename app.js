const express = require('express');
const ejs = require('ejs');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();
const { exec } = require('child_process');


let server;

app.use(express.static(path.join(__dirname, 'views')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});


const upload = multer({ storage: storage });

app.engine('html', ejs.__express);

app.use(express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'html');

app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', upload.single('fichier'), (req, res) => {
    const uploadedFilePath = path.join(__dirname, 'uploads', req.file.originalname);
    console.log(uploadedFilePath);
    fs.readFile(uploadedFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.send('Error reading the uploaded file.');
        } else {
            // Display the text content in a div.
            res.send(`
                <div>
                    <h2>Fichier uploader avec succes</h2>
                    <pre>${data}</pre>
                </div>
                <p><a href="/">Revenir a la page d'accueil</a></p>
            `);
        }
    });
});

app.post('/shutdown', (req, res) => {
    console.log('Server shutting down...');
    res.send('Server is going down...');

    // Gracefully exit the Node.js process after a short delay (e.g., 2 seconds)
    setTimeout(() => {
        process.exit(0);
    }, 2000);
});

server = app.listen(3000, () => {
    console.log('Server started on port 3000');
    console.log('SimpleHTTPServer started on port 8080');
    exec('python -m SimpleHTTPServer 8080', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting SimpleHTTPServer: ${error}`);
            return;
        }
    });
});



