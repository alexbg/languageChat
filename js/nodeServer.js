// inicia un socket cuya funcion es ser de servidor
var server = require('socket.io').listen(3000);

// almacena informacion sobre los usuarios
var users = {};

server.sockets.on('connection',function(socket){
   
   // pide al cliente que se identifique.
   socket.emit('who');
   
   // este evento se lanzara cuando el usuario envie su nombre de usuario
   // luego el server el enviara la lista de usuarios y le dara la bienvenida
   socket.on('user',function(user){
       // almacena el username
      users[socket['id']] = user;
      console.log(user);
      // si ya hay algun usuario se enviara in emit update
      // para que todos los usuarios actualicen su informacion
      // sobre el nuevo usuario y demas
      if(users['total'] == null){
        users['total'] = 1;
      }
      else{
        users['total']++;
        var info = getInfo(socket);
        socket.broadcast.emit('update',info);
      }
      
      // permite enviarle la informacion de los usuarios que hay conectados
      socket.emit('users',users);
      
      // Hace que muestre el alert de bienvenida al usuario
      socket.emit('welcome','Bienvenido al chat '+user['username']);  
      
   });
   
   // Si algun usuario se desconecta, ejecutara este evento
   // reduce el total de usuarios, elimina al usuario desconectado
   // y emite esa informacion a los usuarios
   socket.on('disconnect',function(){
       users['total']--;
       delete users[socket['id']];
       var info = getInfo(socket);
       socket.broadcast.emit('delete',info);
   })
   
   console.log(users);
});

// prepara la informacion a enviar a los otros usuarios
// cuando un nuevo usuario se conecta
function getInfo(socket){
    var info = new Array();
    // usuarios totales conectados
    info.push(users['total']);
    // toda la informacion del usuario
    info.push(users[socket['id']]);
    // el id del socket del usuario
    info.push(socket['id']);
    // devuelve la informacion
    return info;
}

function addUser(){
    
}

function updateUsers(){
    
}