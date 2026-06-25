import express from "express";
import {createServer} from "node:http";
import cors from "cors";
import {Server} from "socket.io";
import 'dotenv/config';
import connectDb from "./init/connectDb.js";
import userRoutes from "./routes/user.route.js";
import { socketController } from "./controllers/socket.controller.js";
const Port = process.env.PORT || 5000;
const app = express();
const server = createServer(app);
const io = socketController(server);

connectDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/auth', userRoutes);

app.get('/', (req, res) => {
    console.log(req.query)
    res.send('Hello World!');
});

server.listen(Port, async()=>{
    console.log(`Server is running on port: ${Port}`);
});

