const axios = require('axios');
const AWS = require('aws-sdk');
//const { Upload } = require("@aws-sdk/lib-storage");
//const { S3Client, S3 } = require("@aws-sdk/client-s3");

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
                    res.status(200).json({ musicUrl: data.Location });
                //return resolve(data);
                }
                });
                } catch (err) {
        res.status(403).json({ error: `Storage error` });

                //return reject(err);
                }
                })
                }
                
               







                const secretKey = req.params.videokey;
                if(secretKey != "" && secretKey != null && secretKey != undefined && secretKey != "null" ){
                    const fs = require('fs');
                    const ytdl = require('ytdl-core');
                    
                    const download = ytdl('https://www.youtube.com/watch?v='+secretKey, { quality: '140' });
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
