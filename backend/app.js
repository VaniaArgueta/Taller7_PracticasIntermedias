import conn from "./conexion.js"
import Express from 'express'
import bodyParser from 'body-parser';
import cors from "cors"

const app = Express();
var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



  app.get('/obtenerProducto',function(req,res){
    conn.query('SELECT * FROM producto', 
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Selected ' + results.length + ' row(s).');
            
            res.send(results)
            console.log('Done.');
        })
});
app.post('/crearProducto',function(req,res){
    let nombre =req.body.nombre
    let descripcion=req.body.descripcion
    let urlImage=req.body.urlImage
    let precio=req.body.precio
    let cantidad =req.body.cantidad


        conn.query('INSERT INTO producto (nombre,descripcion,URLimage,precio,cantidad) VALUES (?,?,?,?,?);', [nombre,descripcion,urlImage,precio,cantidad],
            function (err, results, fields) {

        
        if (err){
            console.log(err)
            return res.send({ "reservado": false })
        }
        else{
            console.log('Inserted ' + results.affectedRows + ' row(s).');
             return res.send({ "reservado": true })
        }
        })

})

app.post('/ActualizarProducto',function(req,res){
    let id =req.body.idProducto
    let nombre =req.body.nombre
    let descripcion=req.body.descripcion
    let urlImage=req.body.urlImage
    let precio=req.body.precio
    let cantidad =req.body.cantidad

    conn.query('UPDATE producto SET nombre = ?,descripcion = ?,URLimage = ?,precio = ?,cantidad = ? WHERE idProducto = ?', [nombre,descripcion,urlImage,precio,cantidad,id], 
            function (err, results, fields) {
                if (err){
                    console.log(err)
                    return res.send({ "actualizado": false })
                }
                else{
                     console.log('Updated ' + results.affectedRows + ' row(s).');
                     return res.send({ "actualizado": true })
                }
           })

})
app.post('/EliminarProducto',function(req,res){
    let id =req.body.idProducto
    

    conn.query('DELETE FROM producto WHERE idProducto = ?', [id], 
            function (err, results, fields) {
                if (err){
                    console.log(err)
                    return res.send({ "eliminado": false })
                }
                else{
                     console.log('Deleted ' + results.affectedRows + ' row(s).');
                     return res.send({ "Deleted": true })
                }
           })

})

app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
    conn.connect(
      function (err) { 
      if (err) { 
          console.log("!!! Cannot connect !!! Error:",err);
          
      }
      else
      {
      console.log("Connection established.");
          
      }
  });
  });
