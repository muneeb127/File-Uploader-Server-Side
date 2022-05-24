const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
var dir = require('node-dir');

const app = express();

app.use(cors());
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({storage}).array('file');

app.post('/upload', (req, res)=>{
    upload(req, res, (err)=>{
        console.log("Server side: ", req.files);
        if(req.files.length === 0){
            return res.status(400).json({msg: 'No file uploaded'});
        }
        if(err){
            return res.status(500).json(error);
        }

        return res.status(200).send(req.files);
    })
});

// To fetch all files from the folder
app.get('/allfiles', (req, res)=> {
    const filesDirectoryPath = path.join(__dirname, './public');
    console.log(filesDirectoryPath);

    var files = dir.files(filesDirectoryPath, {sync:true, shortName: true});
    console.log(files);

    //Check if the file folder is empty
    if(files === undefined){
        return res.status(200).send([]);
    }
    
    return res.status(200).send(files);
});


app.use(express.json());

//To download a file
app.get('/download', function(req, res){
  
  const filename = req.query.name;
  console.log(filename);
  
  const filesDirectoryPath = path.join(__dirname, './public');
  console.log(filesDirectoryPath);
  
  const file = `${filesDirectoryPath}\\${filename}`;
  console.log("File: ", file);
  res.download(file);

})

app.listen(8000, ()=>{
  console.log('App is running on port 8000');
})





