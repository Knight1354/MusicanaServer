const axios = require('axios');


exports.getmusic = async (req, res) => {
    try {

                const secretKey = req.params.videokey;
                if(secretKey != "" && secretKey != null && secretKey != undefined && secretKey != "null" ){
                    const fs = require('fs');
                    const ytdl = require('ytdl-core');
                    
                    const download = ytdl('https://www.youtube.com/watch?v='+secretKey, { quality: '140' });
                    
                    const writeStream = fs.createWriteStream('./assets/music/'+secretKey+'.mp4'); 
                    
                    download.pipe(writeStream);
                    res.status(200).json({ musicUrl: window.location.host+secretKey+".mp4" });

                }else{
                    res.status(401).json({ error: "Invalid request" });
                }

    } catch (error) {
        res.status(404).json({ error: `Video data for ${secretKey} not found` });
    }
};
