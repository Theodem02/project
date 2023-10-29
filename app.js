const express = require('express');
const ejs = require('ejs');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');

const app = express();

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

app.post('/uploads', upload.single('fichier'), async (req, res) => {
    const uploadedFilePath = path.join(__dirname, 'uploads', req.file.originalname);
    console.log(uploadedFilePath);

    // Read the file content
    fs.readFile(uploadedFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            res.send('Error reading the uploaded file.');
        } else {
            try {
                // Send the file content to the second container using an HTTP POST request
                const response = await axios.post('http://file-listener:4000/upload', {
                    content: data,
                    filename: req.file.originalname
                });
                console.log(response.data);

                // Add a line to print a success message
                console.log('File successfully uploaded to the second container.');

                res.send(`
                    <div>
                        <h2>File uploaded successfully</h2>
                        <pre>${data}</pre>
                    </div>
                    <p><a href="/">Go back to the original page</a></p>
                `);
            } catch (error) {
                console.error(error);
                res.send('Error sending the file to the second container.');
            }
        }
    });
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
