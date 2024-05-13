const axios = require('axios');
const AWS = require('aws-sdk');
const fs = require('fs');
const xml2js = require('xml2js');
var secretKey = "";

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
const filePath = './assets/playlist/playlist.xml';
var nextsong = "";
// Function to parse the XML data
function parseXML(data) {
  const parser = new xml2js.Parser();
  return parser.parseStringPromise(data);
}

// Function to get key by ID
async function getKeyById() {
  try {
    const xmlUrl = 'https://raw.githubusercontent.com/Knight1354/MusicanaServer/main/assets/playlist/playlist.xml';
    const response = await axios.get(xmlUrl);
    const xmlData = response.data; // Downloaded XML content

    const playlistData = await parseXML(xmlData);

    const fields = playlistData.data.field;
    const randomIndex = getRandomInt(1, fields.length);

    const selectedField = fields[randomIndex];
    if (selectedField.$.key === secretKey) {
      // Handle secret key match logic here (e.g., implement wrapping)
      const nextIndex = (randomIndex + 1) % fields.length; // Wrap around using modulo
      return fields[nextIndex].$.key;
    } else {
      return selectedField.$.key;
    }
  } catch (err) {
    console.error("Error downloading XML:", err);
    return null; // Or handle the error differently
  }
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
                    .then(nextSongKey => {
                      if (nextSongKey) {
                        nextsong=nextSongKey;
                        console.log("Next song:", nextSongKey);
                        // Play the song with the nextSongKey
                      } else {
                        console.log("Error getting next song");
                      }
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
