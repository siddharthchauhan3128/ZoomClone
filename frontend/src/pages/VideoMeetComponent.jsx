/* eslint-disable react-hooks/immutability */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { io } from "socket.io-client";
import servers from '../environment.js';

const server_url =`${servers}`;

const connections = {}

const peerConfigConnections = {
    "iceServers":[
        {"urls" : "stun:stun.l.google.com:19302"}
    ]
}


const VideoMeetComponent = () => {
    const socketRef = useRef();
    const socketIdRef = useRef();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const localVideoRef = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState(true);
    
    let [audio, setAudio] = useState(true);

    let [screen, setScreen] = useState(false);

    let [showModal, setModal] = useState();

    let [screenAvailable, setScreenAvailable] = useState(true);

    let [message, setMessage] = useState("")

    let [messages, setMessages] = useState([]);

    let [newMessages, setNewMessage] = useState(0);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let[videos, setVideos] = useState([]);
    const isFormValid = true

    const getPermission = async ()=>{
        try{
            const videoPermission = await navigator.mediaDevices.getUserMedia({video: true});

            if(videoPermission){
                setVideoAvailable(true);
            }else{
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({audio: true});

            if(audioPermission){
                setAudioAvailable(true);
            }else{
                setAudioAvailable(false);
            }

            if(navigator.mediaDevices.getDisplayMedia){
                setScreenAvailable(true);
            }else{
                setScreenAvailable(false);
            }

            if(videoAvailable || audioAvailable){
                const userMediaStream = await navigator.mediaDevices.getUserMedia({video: videoAvailable, audio: audioAvailable});

                if(userMediaStream){
                    window.localStream = userMediaStream;
                    if(localVideoRef.current){
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }

        }catch(err){
            console.log(err);
        }
    }


    useEffect(()=>{
        getPermission();
    },[]);

    const getUserMediaSuccess = (stream) =>{
        try{
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
        }catch(e){
            console.log(e);
        }
        window.localStream = stream;
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
        for(let id in connections){
            if(id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description)=>{
                connections[id].setLocalDescription(description).then(()=>{
                    if (socketRef.current) {
                    socketRef.current.emit("signal", id, JSON.stringify({"sdp": connections[id].localDescription}));
                } else {
                    console.warn("Tried to emit WebRTC signal, but socket wasn't ready yet!");
                }
                }).catch(e => console.log(e));
            })
        }
        stream.getTracks().forEach(track => track.onended = ()=>{
            setVideo(false);
            setAudio(false);

            try{
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }catch(e){
                console.log(e);
            }

            //TODO blackSilence

            const blackSilence = (...args)=> new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream;
                    
             
            for(const id in connections ){
                connections[id].addStream(window.localStream)
                connections[id].createOffer().then((description)=>{
                    connections[id].setLocalDescription(description)
                    .then(()=>{
                        socketRef.current.emit("signal", id, JSON.stringify({"sdp": connections[id].localDescription}))
                    }).catch(e=> console.log(e))
                })
            }
        })
    }

    let silence = ()=>{
        let ctx = new AudioContext();
        let osc = ctx.createOscillator();

        let dst = osc.connect(ctx.createMediaStreamDestination());

        osc.start();
        ctx.resume();

        return Object.assign(dst.stream.getAudioTracks()[0],{enabled : false});
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(
            document.createElement("canvas"),
            { width, height }
        );

        canvas
            .getContext("2d")
            .fillRect(0, 0, width, height);

        const stream = canvas.captureStream();

        return Object.assign(
            stream.getVideoTracks()[0],
            { enabled: false }
        );
    };

    const getUserMedia = ()=>{
        if((video && videoAvailable) || (audio && audioAvailable)){
            navigator.mediaDevices.getUserMedia({video: video, audio: audio})
            .then(getUserMediaSuccess)
            .then((stream)=>{})
            .catch((e)=>console.log(e))
        }else{
            try{
                const tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }catch(e){
                console.log(e);
            }
        }
    }

    useEffect(() => {
        // 🌟 Check if the socket is actually connected first!
        if (socketRef.current && socketRef.current.connected) {
            if (video !== undefined || audio !== undefined) {
                getUserMedia();
            }
        } else {
            // If the socket isn't ready yet, we wait for the 'connect' event
            if (socketRef.current) {
                socketRef.current.on("connect", () => {
                    if (video !== undefined || audio !== undefined) {
                        getUserMedia();
                    }
                });
            }
        }
    }, [audio, video]);

    const gotMessageFromServer = (message, fromId) => {
        const signal = JSON.parse(message);
        if(fromId !== socketIdRef.current){
            if(signal.sdp){
                if (!connections[fromId]) return;

                if (signal.sdp) {
                    connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                        // Proceed with creating the answer
                        if (signal.sdp.type === "offer") {
                            connections[fromId].createAnswer().then((description) => {
                                connections[fromId].setLocalDescription(description).then(() => {
                                    socketRef.current.emit("signal", fromId, JSON.stringify({"sdp": connections[fromId].localDescription}));
                                }).catch(e => console.log(e));
                            }).catch(e => console.log(e));
                        }
                    }).catch(e => console.log("SDP Error:", e));
                }

                if (signal.ice) {
                    const candidate = new RTCIceCandidate(signal.ice);
                        connections[fromId].addIceCandidate(candidate)
                            .catch(e => console.log("ICE Error:", e));
                }
            }
        
        }
    }
    const addMessage = (data, sender, socketIdSender)=>{
        setMessages((prevMessage)=>
            [...prevMessage, {data: data, sender:sender}]
        )

        if(socketIdSender !== socketIdRef.current){
            setNewMessage((prev) => prev + 1);
        }

    }
    
    const connectToSocketServer = () => {
    
    socketRef.current = io.connect(server_url, {secure: false});
    socketRef.current.on('signal', gotMessageFromServer);

    socketRef.current.on("connect", () => {
        socketRef.current.emit("join-call", window.location.href);
        socketIdRef.current = socketRef.current.id;
        socketRef.current.on("chat-message", addMessage);

        socketRef.current.on("user-left", (id) => {
           if (connections[id]) {
            connections[id].close();
            delete connections[id];
            connections[id] = null;
        }

        setVideos((prevVideos) => prevVideos.filter((video) => video.socketId !== id));
        });

        socketRef.current.on("user-joined", (id, clients) => {
            clients?.forEach((socketListId) => {
                connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                connections[socketListId].onicecandidate = (event) => { 
                    if(event.candidate !== null){
                        if (socketRef.current && socketRef.current.connected) {
                            socketRef.current.emit("signal", id, JSON.stringify({ "ice": event.candidate }));
                        } else {
                            console.warn("Socket not ready. Storing or dropping ICE candidate temporarily.");
                        }
                    }
                };

                // FIXED: Use the modern 'ontrack' instead of 'onaddstream'
                connections[socketListId].ontrack = (event) => {
                    let remoteStream = event.streams[0]; 

                    // 🌟 Move the check INSIDE the setter so it uses the absolute latest state queue
                    setVideos((currentVideos) => {
                        let videoExists = currentVideos.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            // It already exists (e.g. Audio track already fired). Just update the stream!
                            const updatedVideos = currentVideos.map(video => {
                                return video.socketId === socketListId ? {...video, stream: remoteStream } : video;
                            });
                            videoRef.current = updatedVideos; 
                            return updatedVideos;
                            
                        } else {
                            // First time seeing this user. Create a new box!
                            const newVideo = { 
                                socketId: socketListId,
                                stream: remoteStream,
                                autoPlay: true,
                                playsinline: true 
                            };
                            const updatedVideos = [...currentVideos, newVideo]; 
                            videoRef.current = updatedVideos; 
                            return updatedVideos;
                        }
                    });
                };

                if(window.localStream !== undefined && window.localStream !== null){
                    try {
                        window.localStream.getTracks().forEach(track => {
                            connections[socketListId].addTrack(track, window.localStream);
                        });
                    } catch(e) { console.log("Track already added") }
                } else {
                    const blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                    window.localStream = blackSilence();
                    try {
                        window.localStream.getTracks().forEach(track => {
                            connections[socketListId].addTrack(track, window.localStream);
                        });
                    } catch(e) { console.log("Track already added") }
                }
            });

            if (id === socketIdRef.current) {
                for (let id2 in connections) {
                    if (id2 === socketIdRef.current) continue;
                    
                    // We removed addStream here because addTrack already handled it!
                    
                    connections[id2].createOffer().then((description) => {
                        connections[id2].setLocalDescription(description).then(() => {
                            socketRef.current.emit("signal", id2, JSON.stringify({"sdp": connections[id2].localDescription}));
                        }).catch(e => console.log("Offer setLocalDescription Error:", e));
                    }).catch(e => console.log("createOffer Error:", e));
                }
            };
        });
    });
}


  let getMedia = ()=>{
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }


    const handleAudio = ()=>{
        setAudio(!audio);
    }

    const handleVideo = ()=>{
        setVideo(!video);
    }

    const handleEndCall = () => {
        socketRef.current.emit("end-call", socketIdRef.current);
        socketRef.current.disconnect();
        socketRef.current = null;
        const userId = user?._id || user?.id || "guest";

        navigate(`/dashboard/${userId}`);
    };
    const getDisplayMediaSuccess = (stream)=>{
        try{
            if(window.localStream){
            window.localStream.getTracks().forEach(track => track.stop());
            }
        } catch(e) { console.log(e) }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections){
            if(id === socketIdRef.current) continue;
            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description).then(()=>{
                    socketRef.current.emit("signal", id, JSON.stringify({'sdp': connections[id].localDescription}))
                })
            });
        }

        stream.getTracks().forEach(track => track.onended = ()=>{
            setScreen(false);

            try{
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }catch(e) { console.log(e) }

            //black silenc
            const blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream;

            getUserMedia();
        });
    }

    const handleScreen = () => {
        // If we are NOT sharing, ask for the screen
        if (!screen) {
            // 🌟 FIX 3: Changed getUserMedia to getDisplayMedia so it asks for the screen, not the camera!
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then((stream) => {
                        setScreen(true); // Update the React state
                        getDisplayMediaSuccess(stream);
                    })
                    .catch(e => console.log("Screen share cancelled:", e));
            }
        } 
        // If we ARE already sharing, stop it and go back to camera
        else {
            setScreen(false);
            try {
                if (window.localStream) {
                    window.localStream.getTracks().forEach(track => track.stop());
                }
            } catch (e) { console.log(e) }

            getUserMedia(); // Turn the camera back on
        }
    };

    const handleSendMessage = () => {
        socketRef.current.emit("chat-message",message, username);
        setMessage(" ");
    };
    const totalParticipants = videos.length + 1; 
    // Dynamically determine the grid layout based on participant count
    let gridLayout = "grid-cols-1"; // Default for 1 person

    if (totalParticipants === 2) {
        gridLayout = "sm:grid-cols-2"; // 2 people: Side by side
    } else if (totalParticipants === 3 || totalParticipants === 4) {
        gridLayout = "sm:grid-cols-2 lg:grid-cols-2"; // 3-4 people: 2x2 grid
    } else if (totalParticipants >= 5 && totalParticipants <= 9) {
        gridLayout = "sm:grid-cols-2 lg:grid-cols-3"; // 5-9 people: 3x3 grid
    } else if (totalParticipants > 9) {
        gridLayout = "sm:grid-cols-3 lg:grid-cols-4"; // 10+ people: 4x4 grid
    }
   return (
        <div className="h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden flex flex-col">
            {askForUsername === true ? (
            // --- LOBBY SCREEN ---
            <div className="flex flex-col items-center justify-center h-full bg-slate-50">
                <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md flex flex-col items-center border border-slate-200">
                <h2 className="text-3xl font-bold mb-8 text-slate-800 tracking-tight">Enter into lobby</h2>
                
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden mb-6 relative shadow-inner">
                    <video
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover transform scale-x-[-1]"
                    ref={(element) => {
                        localVideoRef.current = element;
                        if (element && window.localStream && element.srcObject !== window.localStream) {
                        element.srcObject = window.localStream;
                        }
                    }}
                    ></video>
                </div>

                <div className="w-full relative">
                    <input
                    type="text"
                    name="name"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0b5cff] focus:ring-2 focus:ring-blue-500/20 text-slate-800 text-[16px] transition-all mb-4 placeholder-slate-400"
                    />
                </div>
                
                <button
                    disabled={!username}
                    onClick={connect}
                    className={`w-full font-bold py-4 rounded-xl text-[16px] transition-all duration-200 shadow-md ${
                    username
                        ? 'bg-[#0b5cff] text-white hover:bg-blue-600 cursor-pointer shadow-blue-500/30'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    Connect
                </button>
                </div>
            </div>
            ) : (
            // --- MEETING SCREEN ---
            <>
                {/* 1. Top Bar */}
                <div className="h-12 flex items-center justify-between px-6 bg-white border-b border-slate-200 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-[13px] font-semibold text-slate-700 tracking-wide">Meeting in progress</span>
                </div>
                <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    ID: {window.location?.pathname?.split('/').pop() || '123'}
                </span>
                </div>

                {/* 2. Main Content Area & Chat Sidebar */}
        <div className="flex-1 flex overflow-hidden relative bg-slate-50">
          
          {/* --- VIDEO AREA --- */}
          <div className="flex-1 relative overflow-hidden flex flex-col p-4 md:p-6 transition-all duration-300">
            
            {/* Remote Cameras Grid */}
            <div className="flex-1 flex items-center justify-center w-full h-full">
              {videos.length === 0 ? (
                 <div className="text-slate-400 text-lg font-medium">Waiting for others to join...</div>
              ) : (
                 <div className={`grid ${videos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} auto-rows-fr gap-4 w-full h-full max-w-7xl`}>
                   {videos.map((video) => (
                     <div key={video.socketId} className="relative rounded-2xl overflow-hidden bg-white shadow-md ring-1 ring-slate-200 h-full w-full">
                       <video autoPlay playsInline className="w-full h-full object-cover bg-slate-100" ref={(element) => { if (element && video.stream && element.srcObject !== video.stream) element.srcObject = video.stream; }} />
                       <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-200/50 shadow-sm">
                         {username?.[video.socketId] || `User: ${video.socketId.substring(0, 5)}`}
                       </div>
                     </div>
                   ))}
                 </div>
              )}
            </div>

            {/* Floating Local Camera */}
            <div className="absolute bottom-6 right-6 w-56 md:w-64 aspect-video bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-200 z-40 transition-all hover:scale-105">
              <video autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1] bg-slate-100" ref={(element) => { localVideoRef.current = element; if (element && window.localStream && element.srcObject !== window.localStream) element.srcObject = window.localStream; }}></video>
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-200/50 shadow-sm">
                You ({username || 'Local'})
              </div>
            </div>
          </div>

          {/* --- CHAT SIDEBAR --- */}
          {showModal && (
            <div className="w-80 md:w-96 bg-white border-l border-slate-200 flex flex-col z-30 shadow-2xl animate-fade-in-right">
              {/* Chat Header */}
              <div className="h-14 flex items-center justify-between px-5 border-b border-slate-200 bg-white">
                <h3 className="text-[15px] font-semibold text-slate-800">In-Call Messages</h3>
                <button onClick={() => setModal(false)} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              {/* Chat Messages */}
               <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-400 mb-1 px-1">{msg.sender}</span>
                    <div className={`text-[13px] px-3.5 py-2.5 rounded-xl max-w-[85%] shadow-sm ${
                      msg.isMe 
                        ? 'bg-[#0b5cff] text-white rounded-tr-sm' // Blue bubble for you
                        : msg.sender === 'System' 
                          ? 'bg-slate-200 text-slate-600 rounded-tl-sm text-center italic w-full' // Gray for system
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm' // Light gray for others
                    }`}>
                      {msg.data || ' '}
                    </div>
                  </div>
                ))}
              </div>
              
                <div className="p-4 border-t border-slate-200 bg-white">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-full border border-slate-200 p-1 pl-4 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <input 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text" 
                        placeholder="Type a message..." 
                        className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-[14px] font-medium" />

                        <button 
                            onClick={handleSendMessage}
                            className="bg-[#0b5cff] hover:bg-blue-600 text-white p-2 rounded-full transition-colors flex items-center justify-center disabled:opacity-50"
                            // disabled={!message.trim()}
                        >
                            <svg className="w-6 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </div>
                </div>  
            </div>
            )
          }
        </div>


                {/* 3. Bottom Control Bar */}
                <div className="h-[88px] bg-white flex items-center justify-center gap-6 px-6 border-t border-slate-200 z-20 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                
                {/* Mute Button */}
                {audio === true ? (
                    <button onClick={handleAudio} className="flex flex-col items-center justify-center w-16 h-16 rounded-xl hover:bg-slate-100 transition-colors text-slate-600 group">
                    <div className="bg-slate-100 group-hover:bg-slate-200 p-3.5 rounded-full mb-1.5 transition-colors text-slate-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                    </div>
                    <span className="text-[11px] font-medium tracking-wide">Mute</span>
                    </button>
                ) : (
                    <button onClick={handleAudio} className="flex flex-col items-center justify-center w-16 h-16 rounded-xl hover:bg-red-50 transition-colors text-red-600 group">
                    <div className="bg-red-100 group-hover:bg-red-200 p-3.5 rounded-full mb-1.5 transition-colors text-red-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                    </div>
                    <span className="text-[11px] font-medium text-red-500 tracking-wide">Unmute</span>
                    </button>
                )}

                {/* Video Button */}
                {video === true ? (
                    <button onClick={handleVideo} className="flex flex-col items-center justify-center w-16 h-16 rounded-xl hover:bg-slate-100 transition-colors text-slate-600 group">
                    <div className="bg-slate-100 group-hover:bg-slate-200 p-3.5 rounded-full mb-1.5 transition-colors text-slate-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </div>
                    <span className="text-[11px] font-medium tracking-wide">Stop Video</span>
                    </button>
                ) : (
                    <button onClick={handleVideo} className="flex flex-col items-center justify-center w-16 h-16 rounded-xl hover:bg-red-50 transition-colors text-red-600 group">
                    <div className="bg-red-100 group-hover:bg-red-200 p-3.5 rounded-full mb-1.5 transition-colors text-red-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z M3 3l18 18"></path></svg>
                    </div>
                    <span className="text-[11px] font-medium text-red-500 tracking-wide">Start Video</span>
                    </button>
                )}

                {screen === true ? (
                    // STATE: Screen IS Sharing (Active Green UI)
                    <button onClick={handleScreen} className="flex flex-col items-center justify-center w-16 h-16 rounded-xl hover:bg-green-50 transition-colors text-green-600 group">
                        <div className="bg-green-100 group-hover:bg-green-200 p-3.5 rounded-full mb-1.5 transition-colors text-green-600">
                            {/* Active share screen monitor SVG */}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <span className="text-[11px] font-medium tracking-wide text-green-600">Sharing</span>
                    </button>
                ) : (
                    // STATE: No Screen Sharing (Standard Neutral Gray UI)
                    <button onClick={handleScreen} className="flex flex-col items-center justify-center w-16 h-16 rounded-xl hover:bg-slate-100 transition-colors text-slate-600 group">
                        <div className="bg-slate-100 group-hover:bg-slate-200 p-3.5 rounded-full mb-1.5 transition-colors text-slate-700">
                            {/* Standard monitor SVG */}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <span className="text-[11px] font-medium tracking-wide">ShareScreen</span>
                    </button>
                )}


                <button onClick={() => setModal(!showModal)} className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl hover:bg-slate-100 transition-colors group ${showModal ? 'text-blue-600' : 'text-slate-600'}`}>
                    <div className={`p-3.5 rounded-full mb-1.5 transition-colors ${showModal ? 'bg-blue-100 group-hover:bg-blue-200 text-blue-600' : 'bg-slate-100 group-hover:bg-slate-200 text-slate-700'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                    </div>
                    <span className="text-[11px] font-medium tracking-wide">Chat</span>
                </button>

                {/* End Call Button */}
                <div className="pl-4 ml-2 border-l border-slate-200">
                    <button 
                    onClick={handleEndCall}
                    className="flex items-center justify-center px-6 py-2.5 bg-[#ff2a2a] hover:bg-[#e60000] text-white rounded-lg font-bold text-sm transition-colors shadow-md shadow-red-500/20"
                    >
                    End Call
                    </button>
                </div>


                
                
                </div>
            </>
            )}
        </div>
        );
    }

export default VideoMeetComponent
