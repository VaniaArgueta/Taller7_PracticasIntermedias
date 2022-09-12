import conn from "./conexion.js";
import Express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from 'multer';
import path from 'path';
import {fileURLToPath} from 'url';
import fs, { read } from 'fs';
//import uploadFile from '../s3';
//import readFile from '../s3';
import * as dotenv from 'dotenv';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

//const uploadFile = require('./app2')

const app = Express(); 
app.use(Express.json({limit: '25mb'}));
app.use(Express.urlencoded({limit: '25mb', extended: true}));
var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(multer);


async function uploadFile(pathFile){
    const stream = fs.createReadStream(pathFile);
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: 'archivo',
        Body: stream
      };
    const command = new PutObjectCommand(uploadParams);
    return await client.send(command);
}

async function readFile(file){
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: 'telescopio_hubble_stellar_spire_in_the_eagle_nebula_0.jpg'
    });
    return await client.send(command);
    /*const result = await client.send(command);    
    result.Body.pipe(fs.createWriteStream('./images/telescopio_hubble_stellar_spire_in_the_eagle_nebula_0.jpg'));
    console.log('archivo correcto');*/
}

app.get("/obtenerProductoS3", async (req, res) => {
  const result = await readFile();
  console.log(result);
  res.send('enviado');
});

app.get("/obtenerProducto2", function (req, res) {
  conn.query("SELECT * FROM producto ", function (err, results, fields) {
    if (err) throw err;
    else console.log("Selected " + results.length + " row(s).");

    res.send((results));
    console.log("Selected " + results.length + " row(s).");
  });
});

app.get("/obtenerProducto", function (req, res) {
  conn.query("SELECT * FROM producto", function (err, results, fields) {
    if (err) throw err;
    else console.log("Selected " + results.length + " row(s).");

    res.send(results);
    console.log("Done.");
  });
});

app.post("/crearProducto", function (req, res) {
  let nombre = req.body.data.nombre;
  let descripcion = req.body.data.descripcion;
  let urlImage = req.body.data.urlImage;
  let precio = req.body.data.precio;
  let cantidad = req.body.data.cantidad;

  console.log('nombre ' + data.nombre);
  console.log('precio '+data.precio);

  conn.query(
    "INSERT INTO producto (nombre, descripcion,URLimage,precio,cantidad) VALUES (?,?,?,?,?);",
    [nombre, descripcion, urlImage, precio, cantidad],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.send({ insertaProducto: false });
      } else {
        console.log("Inserted " + results.affectedRows + " row(s).");
        return res.send({ insertaProducto: true });
      }
    }
  );
});



/*const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//console.log('directory-name ', __dirname)

const diskStorage = multer.diskStorage({
  destination: path.join(__dirname,'./images'),
  filename: (req,file,cb) => {
    cb(null,file.originalname)
  } 
});
const fileUp = multer({
  storage: diskStorage
});*/

function uploadFile2(){
  const storage = multer.diskStorage({
      destination: './images',
      filename: (_req,file,cb) => {
        cb(null,file.originalname)
      } 
    });  
  const upload = multer({storage:storage}).single('imagen');
  return upload;
}

app.post("/crearProducto2", function (req, res) {
  console.log('Ingresó a /crearProducto2');
  let nombre = req.body.nombre;
  let descripcion = req.body.descripcion;
  let URLImage = '';
  let imagen = req.body.imagen;
  let precio = req.body.precio;
  let cantidad = req.body.cantidad;

  console.log('nombre ' + nombre);

  conn.query(
    "INSERT INTO producto (nombre, descripcion, URLImage, imagen,precio,cantidad) VALUES (?,?,?,?,?,?);",
    [nombre, descripcion, URLImage, imagen.replace("'","''"), precio, cantidad],
    //[nombre, descripcion, imagen, precio, cantidad],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.send({ insertaProducto: false });
      } else {
        console.log("Inserted " + results.affectedRows + " row(s).");
        return res.send({ insertaProducto: true });
      }
    }
  );
});

/*app.post("/crearProductoS3", async(req, res) {
  console.log(req.files);
  const result = uploadFile(req.files[0].tempFilePath);
  console.log(result);
  app.send('archivo subido');
});*/

app.put("/ActualizarProducto/(:id)", function (req, res) {
  let id = req.params.id;
  let nombre = req.body.nombre;
  let descripcion = req.body.descripcion;
  let urlImage = req.body.urlImage;
  let precio = req.body.precio;
  let cantidad = req.body.cantidad;

  conn.query(
    "UPDATE producto SET nombre = ?,descripcion = ?,URLimage = ?,precio = ?,cantidad = ? WHERE idProducto = ?",
    [nombre, descripcion, urlImage, precio, cantidad, id],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.send({ actualizado: false });
      } else {
        console.log("Updated " + results.affectedRows + " row(s).");
        return res.send({ actualizado: true });
      }
    }
  );
});
app.delete("/EliminarProducto/(:id)", function (req, res) {
  let id = req.params.id;

  conn.query(
    "DELETE FROM producto WHERE idProducto = ?",
    [id],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.send({ eliminado: false });
      } else {
        console.log("Deleted " + results.affectedRows + " row(s).");
        return res.send({ Deleted: true });
      }
    }
  );
});

app.listen(3000, () => {
  console.log("El servidor está inicializado en el puerto 3000");
  conn.connect(function (err) {
    if (err) {
      console.log("!!! Cannot connect !!! Error:", err);
    } else {
      console.log("Connection established.");
    }
  });
});
