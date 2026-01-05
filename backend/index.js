const express = require("express")
const cors = require("cors")
const path = require("path")
const app = express()
const mongoose = require("mongoose")

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../')))

mongoose.connect("mongodb://127.0.0.1:27017/passkey").then(function(){
    console.log("DB Connected")
}).catch(function(error){
    console.log("DB Connection Failed:", error.message)
})

const credentials = mongoose.model("credentials",{},"bulkmail")


app.post("/sendmail", async function(req,res){
    const nodemailer = require("nodemailer");

    var msg = req.body.msg
    var emailList = req.body.emailList

    try {
        const data = await credentials.find();
        if (data.length === 0) {
            return res.status(400).send("No credentials found");
        }
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: data[0].user,
                pass: data[0].pass,
            },
        });

        const promises = emailList.map(email => {
            return transporter.sendMail({
                from: "pradeep.bps24@gmail.com",
                to: email,
                subject:"A Message from Bulk Mail",
                text: msg
            });
        });

        await Promise.all(promises);
        res.send("All emails sent successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error sending emails");
    }
});


app.listen(5000,function(){
    console.log("Server is running on port 5000")
})



