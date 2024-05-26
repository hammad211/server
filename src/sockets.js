
const io = require('socket.io')(5080,{
    cors :{
        origin:'http://localhost:3000',
    }
  });

  let userss = [];

  io.on('connection',socket =>{

    socket.on('addUser',userId =>{
        const isUser = userss.find(user=> user.userId===userId);
        if(!isUser){
        const user = {userId, socketId:socket.id} 
        userss.push(user);
        console.log("userss array", userss);
        io.emit('getUsers',userss);}
        })

        socket.on('sendMessage', ({ conversationId, senderId, message, receiverId, formattedTime, formattedDate }) => {
          try {
              const receive = userss.find(user => user.userId === receiverId);
              const sender = userss.find(user => user.userId === senderId);
              console.log("receiverss", receive);
              console.log("sender", sender);
              console.log(conversationId, senderId, message, receiverId, formattedTime, formattedDate);
              if (receive) {
                  io.to(receive.socketId).to(sender.socketId).emit('newMessage', {
                      conversationId, senderId, message, receiverId, formattedTime, formattedDate
                  });
              }
              else if(sender){
                
                  io.to(sender.socketId).emit('newMessage', {
                      conversationId, senderId, message, receiverId, formattedTime, formattedDate
                  });
             
              }
          } catch (error) {
              console.log(error);
          }
      });   
   
    socket.on('addNewRequest', () => {
      console.log('Received addCourse event on the server');
      io.emit('getCourse');
    });

    socket.on('fetch', () => {
      console.log('Received mmm event on the server');
      io.emit('fetchMessages');
    });
    
    socket.on('getReq', () => {
        io.emit('getReq');
      });

      socket.on('Proposal', (proposal) => {
        console.log("socket called");
        io.emit('Proposal', proposal);
      });  
  
  
    socket.on('disconnect',()=>{
        userss = userss.filter(user=>user.socketId !== socket.id);
        io.emit('getUsers',userss);
    })    
  })  

  module.exports = io;
