// inicia un socket cuya funcion es ser de servidor
var server = require('socket.io').listen(3000);
var url = require('url');
var query = require('querystring');

// almacena informacion sobre los usuarios
/**
 * users =>
 *  identificador del socket => username
 *  total => numero de usuarios online
 *  OOOOOOOOOOOOOOOO
 *  users =>
 *  identificador del socket => array(
 *      username=>el username,
 *      native_langauge => el idioma nativo)
 *  total => numero de usuarios online
 * @type user
 */
// Una lista a parte para tener la informacion de todos os usuarios
// Es la lista que se le pasa al cliente para generar la tabla
var users = {};
var sockets = new Array();
// Total de usuarios conectado
var total = 0;
//var clients = server.sockets.clients();
server.sockets.on('connection',function(socket){
    
    socket.emit('who');
   /*var get = url.parse(socket.handshake.url);
   var params = query.parse(get['query']);
   if(params['user'] != null){
       if(!users.hasOwnProperty(params['user'])){
          
            users[params['user']]={
                'username':params['user'],
                'native':params['native'],
            };
            
            
            console.log(users);
        }
        else{
            clearTimeout(users[params['user']]);
        }  
   }
   else{
       console.log('no funciona');
   }*/
   
   // USAR EL server.sockets.clients() PARA GENERAR UN ARRAY Y 
    // PASARLE SIEMPRE EL ARRAY AL COMPLETO AL GRID PARA QUE
    // COMPRUEBE QUE HA CAMBIADO
   //console.log(users);
   
   
   
   // si el usuario se ha logueado, se enviada un broadcast a todos para que 
   // actualicen las tablas
   socket.on('login',function(){
       socket.broadcast.emit('update');
   });
   
   socket.on('delete',function(){
       socket.broadcast.emit('update');
   });
   
   
   
   socket.on('dni',function(data){
       if(!users.hasOwnProperty(data['username'])){
            
            
            //sockets.push(socket);
            
            /*s.push(data['username']);
            
            s.push(socket);*/
           // GUARDA LA INFORMACIONNNN METER EL users DENTRO DE server.sockets.clients()
           // Y HACER LA LISTA CON ESOS DATOS GUARDADOS, YA QUE EL CLIENTE SE ELIMINA
           // CUANDO SE PIERDE LA CONEXION POR COMPLETO, PERO SI SE REFRESCA LA PAGINA
           // LA INFORMACION ESCRITA SE MANTIENE
           // COMPRAR EL CLIENTS() CON EL USERS POR COUNT. SI UNO ES MAYOR O MENOR EN TAMAÑO
           // ISGNIFICA QUE HA HABIDO ALGUIEN CAMBIO, ENTONCES AÑADE A LA LISTA EL CAMBIO
           // NUEVO O ELIMINAR. PORQUE TIENE QUE HABER TANTOS CLIENTES COMO USUARIOS HAY
           // AADIR A CADA CLIENTE EL EL SERVER.SOCKETS.CLIENTS() EL USUARIO AL QUE PERTENECE
           // Y DE AHI OBTENER LA TABLA DE USUARIOS
            
            // ESTOS DATOS EN EL CLIENTE SE COJEN POR LAS COOKIES
            var user = {
                'username':data['username'],
                'native_language':data['native'],
                'foreign_language':data['foreign'],
                'connected':true,
            }
                    
            
            users[data['username']] = user
            
            //var allClients = server.sockets.clients();
            //var totalClient =  allClients.length - 1;
            
            // Añado el usuario al ultimo cliente
            //allClients[totalClient]['user'] = user
            
            // Aumento + 1 los clientes conectado cuando un usuario NUEVO se ha 
            // conectado
            
            if(total != 0){
                total++;
            }
            else{
                total = 1;
            }
            
            users['total'] = total;
            
            server.sockets.emit('update',users);
           
        }
        else{
            //setTime(data['username']);
            socket.emit('update',users);
            users[data['username']].connected = true;
            console.log(users[data['username']]);
        }
   });
   
  
   
   socket.on('disconnect',function(){
        console.log('DESCONECTADOOO');

        // obtengo el usuario que se ha conectado
        var user = socket.handshake.query.user;
        
        // pongo a false la conexon
        users[user].connected = false;
        // ejecuto al funcion setTime la cual si el atributo
        // connected sigue en false, eliminara ese usuario
        setTime(user);
   });
   
   socket.on('update',function(){
       socket.emit('update',users);
   })
  
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
// Si al cabo de 5 segundos, el usuario no se ha vuelto a conectar, sera eliminado
function setTime(username){
    setTimeout(function(){
        console.log('USUARIOOO: '+username);
        try{
            if(!users[username].connected){
                delete users[username];
                total--;
                users['total'] = total;
                console.log(total);
                server.sockets.emit('update',users);
            }
        }
        catch(err){
            console.log('El usuario no existe');
        }
    },5000);
}

// permite saber si un usuario se ha desconectado del todo,e s decir, si ha cerrado
// el navegador o la pestaña. Para eso el servidor tiene los clientes, cada cliente
// es unico y digamos que "SOLO" se borra cuando el usuario cierra o el navegador o 
// la pestaña. Entonces comparo los usuarios totales que tenia registrados con
// los usuarios que hay realmente conectados en este momento. Si es menor el
//total de clientes, significa que uno se ha ido, por eso ejecuta la funcion createUsers
function close(){
    var allClients = server.sockets.clients();
    var totalClient =  allClients.length;
    if(totalClient < total){
        createUsers();
        total = totalClient;
    }
}

// permite a partir de los usuarios conectados a l servidor
// generar la informacion para pasar al cliente y que le genere la tabla de usuarios
// Para eso borro todos los usuarios que tenia en users(en el cual se guarda toda la informacion
// de cada usuario, y estan ligados con los clientes conectados al server). Cada user en users
// tiene un unico cliente conectado. Entonces genero de nuevo la informacion y mando a todos
// los que esten conectados, a realizar un update a la tabla
function createUsers(){
    console.log('ENTRADO EN CREAR USERS');
    var allClients = server.sockets.clients();
    //console.log(server.sockets.clients());
    users = {};
    allClients.forEach(function(client){
        //console.log(client);
        var user = client['user'].username;
        users[user] = client['user'];  
    });
    
    server.sockets.emit('update',users);
}