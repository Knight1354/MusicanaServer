const axios = require('axios');
const AWS = require('aws-sdk');
const fs = require('fs');
const xml2js = require('xml2js');
var secretKey = "";
var nextsong = "";
const currentDir = process.cwd();
console.log("Current working directory:", currentDir);

try {
  const files = fs.readdirSync(currentDir);
  if (files.length > 0) {
    console.log("Files in the current directory:");
    files.forEach(file => nextsong=String(files));
  } else {
    console.log("No files found in the current directory.");
  }
} catch (err) {
  console.error("Error reading directory:", err);
}
function getRandomInt(min, max) {
    // Ensure min <= max
    if (min > max) {
      [min, max] = [max, min]; // Swap values if needed
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
//const { Upload } = require("@aws-sdk/lib-storage");
//const { S3Client, S3 } = require("@aws-sdk/client-s3");

// Sample XML file path (replace with your actual path)
const filePath = './controller/playlist/playlist.xml';

// Function to parse the XML data
function parseXML(data) {
  const parser = new xml2js.Parser();
  return new Promise((resolve, reject) => {
    parser.parseString(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Function to get key by ID
function getKeyById() {
  return fs.promises.readFile(filePath, 'utf-8')
    .then(parseXML)
    .then(data => {
      const fields = data.data.field;
      var id = getRandomInt(1, fields.length)
      for (const field of fields) {
        if (field.$.id === String(id)) { // Ensure ID conversion to string
            if (field.$.key == secretKey){
var currentid=--id;
                if(id == 0){
                    return  fields[++currentid].$.key;
                }else if(id == fields.length){
                    return  fields[--currentid].$.key;
                }else{
                    return  fields[++currentid].$.key;
                }
            }else{
                return field.$.key;

            }
        }
      }
      return null;
    });
}


exports.getmusic = async (req, res) => {
    try {

        const s3 = new AWS.S3({
            accessKeyId: "AKIA6GBMDD5S7CYOOC6I",
            secretAccessKey: "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",
            });
            
            const BUCKET = 'musicana';

            const uploadFile = (filePath, keyName) => {
  
                return new Promise((resolve, reject) => {
                try {
                // var fs = require('fs');
                // const file = fs.readFileSync(filePath);
                const BUCKET = 'musicana';
                
                const uploadParams = {
                Bucket: BUCKET,
                Key: keyName,
                Body: filePath
                };
                
                s3.upload(uploadParams, function (err, data) {
                if (err) {
        res.status(403).json({ error: `Storage error` });

                //return reject(err);
                }
                if (data) {
                 
                    res.status(200).json({ musicUrl: data.Location,nextSong : nextsong });
                //return resolve(data);
                }
                });
                } catch (err) {
        res.status(403).json({ error: `Storage error` });

                //return reject(err);
                }
                })
                }
                
               







                 secretKey = req.params.videokey;
                if(secretKey != "" && secretKey != null && secretKey != undefined && secretKey != "null" ){
                    const fs = require('fs');
                    const ytdl = require('ytdl-core');
                    
                    const download = ytdl('https://www.youtube.com/watch?v='+secretKey, { quality: '140' });
                    getKeyById()
                    .then(key => {
                      if (key) {
                       // nextsong=key;
                        console.log(`Key for ID 1: ${key}`);
                      } else {
                        console.log("No field found with ID 1");
                      }
                    })
                    .catch(err => {
                      console.error("Error parsing XML:", err);
                    });
                    uploadFile(download,'Music/'+secretKey+'.mp4')
                    //const writeStream = fs.createWriteStream('./assets/music/'+secretKey+'.mp4'); 
                    
                   // download.pipe(writeStream);
                    

                }else{
                    res.status(401).json({ error: "Invalid request" });
                }

    } catch (error) {
        res.status(404).json({ error: `Video data for ${secretKey} not found` });
    }
};
