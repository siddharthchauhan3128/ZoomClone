import { Server } from 'socket.io';

export const socketController = (server) => {
    const connections = {};
    const messages = {};
    const timeOnline = {};
    
    const activeTokens = new Map();

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowHeaders: ["*"],
            credentials: true
        }
    });

    io.on('connection', async (socket) => {
        console.log("Something is connected:", socket.id);

        // --- 1. USER JOINS ---
        socket.on('join-call', (path) => {

            if (connections[path] === undefined) {
                connections[path] = [];
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            connections[path].forEach(id => {
                io.to(id).emit('user-joined', socket.id, connections[path]);
            });

            if (messages[path] !== undefined) {
                messages[path].forEach(msg => {
                    io.to(socket.id).emit('chat-message', msg.data, msg.sender, msg['socket-id-sender']);
                });
            }
        });

        // --- 2. WEBRTC SIGNALING ---
        socket.on('signal', (toId, message) => {
            io.to(toId).emit('signal', message, socket.id);
        });

        // --- 3. CHAT MESSAGES ---
        socket.on('chat-message', (data, sender) => {
            let matchingRoom = null;
            for (const [roomId, roomValue] of Object.entries(connections)) {
                if (roomValue.includes(socket.id)) {
                    matchingRoom = roomId;
                    break;
                }
            }

            if (matchingRoom) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = [];
                }
                messages[matchingRoom].push({ 'sender': sender, 'data': data, 'socket-id-sender': socket.id });
                
                connections[matchingRoom].forEach((socketId) => {
                    io.to(socketId).emit('chat-message', data, sender, socket.id);
                });
            }
        });

        // --- 4. DISCONNECT ---
        socket.on('disconnect', () => {
            if (socket.token && activeTokens.get(socket.token) === socket.id) {
                activeTokens.delete(socket.token);
                console.log(`User session ended: ${socket.token}`);
            }

            for (const [roomId, roomValue] of Object.entries(connections)) {
                let index = roomValue.indexOf(socket.id);
                if (index !== -1) {
                    roomValue.forEach(id => {
                        if (id !== socket.id) io.to(id).emit('user-left', socket.id);
                    });

                    roomValue.splice(index, 1);
                    if (roomValue.length === 0) delete connections[roomId];
                    break;
                }
            }
        });
    });
};

