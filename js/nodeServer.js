// inicia un socket cuya funcion es ser de servidor
var server = require('socket.io').listen(3000);
var url = require('url');
var query = require('querystring');
var mysql = require('mysql');

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


// Total de usuarios conectado
var total = 0;
//var clients = server.sockets.clients();
server.sockets.on('connection',function(socket){
    
    // obtengo la key que identifica al usuario
    var key = socket.handshake.query.key;
    //socket.emit('who');
    

   // Si el usuario no esta registrado(el identificador esta en users), entrara en el if
   // en caso contrario seria en el else
    if(!users.hasOwnProperty(key)){

        // configura la conexion con la base de datos y se conecta a
        // la base de datos language_chat
         var connection = mysql.createConnection({
             host     : 'localhost',
             user     : 'root',
             password : '',
             database : 'language_chat'
           });

         // Hago una query para obtener el username,native_language y foreign_language
         // Cuando se completa la conexion se ejecuta el callback
         connection.query(
                 'SELECT username,native_language,foreign_language FROM users WHERE key_chat=? LIMIT 1',
                 [key],
                 // en el callback, compruebo si ha habido algun error
                 // en caso de que lo haya, lo muestro
                 function(err, rows, fields){
                     if(err){
                         throw err
                     }
                     else{
                         // si ha obtenido los datos, genero el user temporal
                         // para meter la informacion necesaria en users
                         var user = {
                             username:rows[0]['username'],
                             native_language:rows[0]['native_language'],
                             foreign_language:rows[0]['foreign_language'],
                             connected:true,
                         }

                         // en le objeto users meto el la informacion del usuario
                         // obtenida anteriormente y el identificador para ese
                         // nombre sera la key_chat 
                         users[key] = user;

                         // aumento en +1 el total de usuarios conectados
                         if(total != 0){
                             total++;
                         }
                         else{
                             total = 1;
                         }

                         // lo almaceno en el objeto users
                         users['total'] = total;

                         // le digo a todos los usuarios conectados que 
                         // actualicen als tablas
                         server.sockets.emit('update',users);
                     }
                 }
             );
        // Cierro la conexion con la base de datos  
        connection.end()
     }
     else{
         //setTime(data['username']);
         socket.emit('update',users);
         users[key].connected = true;
         //console.log(users[data['key']]);
     }
  
   
  
   // Se ejecuta cuando el usuario se desconecta
   socket.on('disconnect',function(){
        console.log('DESCONECTADOOO');

        // obtengo el usuario que se ha conectado
        var user = socket.handshake.query.key;
        
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


// Si al cabo de 5 segundos, el usuario no se ha vuelto a conectar, sera eliminado
function setTime(key){
    setTimeout(function(){
        console.log('USUARIOOO: '+key);
        try{
            if(!users[key].connected){
                delete users[key];
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