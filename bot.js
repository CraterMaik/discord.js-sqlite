const Discord = require("discord.js");
const client = new Discord.Client();


const bd = require('sqlite');
bd.open("./bd-users.sqlite");

client.login('TOKEN-DISCORDAPP');

client.on('ready', () => {
    console.log('Listo!');
})

//prefix bot
let prefix = '--';

client.on('message', (message) => {
    const cont = message.content.split(' ').slice(1);
    const args = cont.join(' ');

    //usando SQLITE //CREAR EL ARCHIVO .sqlite
    if (message.content.startsWith(prefix + 'create')) {
        //primero creamos una TABLA , "usuarios" // TEXT es un tipo de dato se puede usar var, varchar etc..
        bd.run('CREATE TABLE IF NOT EXISTS usuarios (id TEXT, name TEXT, tag TEXT, avatar TEXT)');
        //este proceso de CREATE solo se debe usar una solo vez.

    } else if (message.content.startsWith(prefix + 'registrar')) {

        //como insertar datos a la base de datos "nuevabd.sqlite"
        //datos de la tabla usuarios (id TEXT, name TEXT, tag TEXT, avatar TEXT)
        bd.run('INSERT INTO usuarios (id, name, tag, avatar) values (?, ?, ?, ?)',
            [message.author.id, message.author.name, message.author.tag, message.author.displayAvatarURL]);

        message.channel.send('Resgistrado correctamente!');
    } else if (message.content.startsWith(prefix + 'listar')) {

        //como lista los datos registrado segun usuario
        bd.get(`SELECT * FROM usuarios WHERE id ="${message.author.id}"`).then(usu => {
            //validar si el usuario no esta registrado
            if (!usu) return message.channel.send('No estas registrado!');

            //si esta registrado muestra los datos segun usuario por ID
            //"usu" es la instacia que generamos al devolver get de la tabla usuarios"
            message.channel.send(`Nombre: ${usu.name}\nTag: ${usu.tag}\nAvatar: ${usu.avatar}`);
        })
    } else if (message.content.startsWith(prefix + 'editar')) {
        //como actualizar los datos de un usuario pero validando que solo el usuario con el ID tal puede actualizarlo.
        //va no se como explicarlo si lo entendiste di si en los comentarios!!
        if(!args) return;
        //creamos los argumentos para cada campo
        let txt = args.split(' ');
        //datos/campos : id, name, tag, avatar
        let nameedit = txt[0];
        let tagedit = txt[1];
        let avataredit = txt[2];

        bd.get(`SELECT * FROM usuarios WHERE id ="${message.author.id}"`).then(usu => {
            //creamos una variable para validar el id con el author del mensaje.
            let validar = usu.id;
            //validar: representa la id del author del mensaje, vamos a comparalo
            if (validar === message.author.id) {
                //si validar es igual al id del author del mensaje actualizamos 
                bd.run(`UPDATE usuarios SET name = "${nameedit}", tag = "${tagedit}", avatar = "${avataredit}"
                 WHERE id = "${validar}"`);

                //si todo el proceso de UPDATE es correcto retornar un mensaje
                message.channel.send('Actualizado correctamente!');
            } else {
                //si validar no es igual al author del mensaje retornamos nada
                message.channel.send('No puedes editar');
            }

        })


    } else if (message.content.startsWith(prefix + 'eliminar')) {
        //como eliminar a un usuario por id o autoeliminarse
        let iduser = args;
        if (!iduser) {
            //como autoeliminarse
            bd.run(`DELETE FROM usuarios WHERE id = "${message.author.id}"`);
            message.channel.send('ya no existes en mi sistema!');

        } else {
            //como eliminar por id
            //esto puede ser util para el creador de bot
            if (message.author.id !== 'IDOWNER') return;
            bd.run(`DELETE FROM usuarios WHERE id = "${args}"`);
            message.channel.send('usuario eliminar correctamente!.');
        }
    } else if (message.content.startsWith(prefix + 'general')) {
        //BONUS: listar todos los usuarios registrados;
        //usamos sqlite3

        const sqlite3 = require('sqlite3').verbose();
        let sql3 = new sqlite3.Database('./bd-users.sqlite');


        let consulta = `SELECT * FROM usuarios`;

        sql3.all(consulta, (err, lista) => {
            lista.forEach(function (filas) {
                //creamos un arrays para guarda todas las filas generadas por el forEach;
                list.push(filas.name);
            });
        });
        //luego de guardar en el arrays mostramos la lista en formato markdown
        //podemos validar la lista si no hay ningun usuario registrado

        if (list.length < 1) return message.channel.send('Lista vacia o no hay usuarios registrados');
        message.channel.send('Lista de usuarios\n' + '```\n' + list + '\n```');
        //una vez mostrado la lista del arrays, reiniciamos el arrays "list" a 0
        list = new Array();

    }
});
//arrays creada "list"
let list = new Array();


