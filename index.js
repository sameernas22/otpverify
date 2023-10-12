const express = require('express');
const serverless = require('serverless-http');
const app = express();
const port = 3000;
const router = express.Router();
const cors = require('cors')

app.use(cors())


const accountSid = "AC6bc613a9934fe60e906e52549e9391e1";
const authToken = "72962775afa8562f6d7d059bc9ae2c43";
const verifySid = "VA0ee9df0b13191e022ad831a6bb510cdb";
const client = require("twilio")(accountSid, authToken);




router.get('/', (req, res) => {
  console.log(__dirname)
  res.sendFile(__dirname+'/public/index.html');
 
});

router.post(`/send-verification-otp`, (req,res)=>{

    const {mobileNumber} =req.body;


    client.verify.v2.services(verifySid)
    .verifications
    .create({to: "+"+  mobileNumber, channel: 'sms'})
    .then(verification => {
        return res.status(200).json({verification});
    })
    .catch(error => {
       return res.status(400).json({error});
    });
});

router.post(`/verify-otp`, (req,res) => {
    const {mobileNumber, otpCode} = req.body;
 
    client.verify.v2.services(verifySid)
      .verificationChecks
      .create({to: "+"+  mobileNumber, code: otpCode})
      .then(verification_check => {
        return res.status(200).json({verification_check})
      })
      .catch(error => {
        return res.status(400).json({error})
      });
} )
app.use(express.static("dist"));
app.use(express.json())
app.use('/.netlify/functions/index', router);
module.exports.handler = serverless(app);
