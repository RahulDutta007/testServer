const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const path = require('path')
const app = express()
var httpServer = require("http").createServer(app);
var io = require("socket.io")(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
});
//Load env vars
dotenv.config({path: './config/config.env'})
// MongoDB connection
connectDB()

app.use((req, res, next ) => {
    res.header("Access-Control-Allow-Origin","*") // we can put a specific webpage or website instead of * to allow access to apis
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,token") // we can also give * as the second parameter string
    if(req.method === "OPTIONS")
    {
        res.header("Access-Control-Allow-Methods","PUT, POST, GET, PATCH, DELETE")
        return res.status(200).json({})
    }
    next() // if we dont put next here, this will block any incoming request and expecting to get OPTIONS here
})
app.use(express.static(path.join(__dirname, '../WebClient/build')));
app.use(express.json())
app.get('/',(req, res) =>{
    res.json({success:true})
})
app.use('/uploads',express.static('uploads'))
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../WebClient/build', 'index.html'));
});
// user Section

app.use("/api/v1/forget-password", require('./api/v1/routes/ForgetPassword')) // 1. request_token 2.verify-token
app.use("/api/v1/forget-username", require('./api/v1/routes/FindUserName'));


// Super Admin Section
app.use("/api/v1/super-admin", require('./api/v1/routes/super_admin/SuperAdmin'))
// app.use("/api/v1/super-admin", require('./api/v1/routes/super_admin/SuperAdmin'))
app.use("/api/v1/super-admin/menu", require('./api/v1/routes/super_admin/MenuControl'));
app.use("/api/v1/super-admin/assign-group", require('./api/v1/routes/group/groupAssign'));
app.use("/api/v1/super-admin/location/delete", require('./api/v1/routes/group/deleteLocation'));
app.use("/api/v1/super-admin/upload-administration", require('./api/v1/routes/super_admin/UploadAdministration'));

// Group
app.use("/api/v1/admin/location", require('./api/v1/routes/group/locations'));
app.use("/api/v1/admin/group", require('./api/v1/routes/group/group'));

// HealthLinks
app.use("/api/v1/health-links",require('./api/v1/routes/healthLinks/healthLinks'));

//notifications
app.use("/api/v1/notifications", require("./api/v1/routes/notifications/Notifications"));

//Employee Page Design
app.use("/api/v1/admin/employee-page-design", require("./api/v1/routes/employeePageDesign/EmployeePageDesign"));
app.use("/api/v1/admin/employee-page-design", require("./api/v1/routes/employeePageDesign/LogoSettings"));
app.use("/api/v1/admin/employee-page-design", require("./api/v1/routes/employeePageDesign/EmployeePageDesignPreview"));
app.use("/api/v1/admin/employee-page-design", require("./api/v1/routes/employeePageDesign/LogoSettingsPreview"));
// Show File
app.use("/api/v1/show-file", require("./api/v1/routes/file/ShowFile"));

app.use(errorHandler)

const PORT = process.env.PORT || 4000;

const server = httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.italic.bold)
    io.on("connection", function (socket) {
        console.log("new socket user" + socket.id);
        socket.on("approval",  message => {
            socket.broadcast.emit("messageSent", message);
            console.log(message);
        });
    });
});

// const server = httpServer.listen(PORT, ()=>{
//     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.italic.bold)
// })

// var getIOInstance = function () {
//     return io;
// };

process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error: ${err.message}`.red)
    server.close(()=>process.exit(1))
})

app.get('/notify', function (res, res) {

    io.sockets.emit("messageSent", {
        "message": "Notification:",
        "link": "Arsenal - The invicibles"
    });

    res.json({
        "msg": "success"
    });
});

module.exports = {
    getIOInstance: () => io
}
app.use("/api/v1/user", require('./api/v1/routes/User'))