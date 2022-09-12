import conn from "./conexion.js";
import Express from "express";
import bodyParser from "body-parser";
import cors from "cors";
//import multer from 'multer';
//import path from 'path';
//import {fileURLToPath} from 'url';
import fs, { read } from 'fs';
//import uploadFile from '../s3';
//import readFile from '../s3';
import * as dotenv from 'dotenv';
//import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import * as AWS from "@aws-sdk/client-s3";

const app = Express(); 
app.use(Express.json({limit: '30mb'}));
app.use(Express.urlencoded({limit: '30mb', extended: true}));
var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(multer);

app.get("/obtenerProducto", function (req, res) {
  conn.query("SELECT * FROM producto ", function (err, results, fields) {
    if (err) throw err;
    else console.log("Selected " + results.length + " row(s).");

    res.send((results));
    console.log("Done");
  });
});

app.post("/crearProducto", function (req, res) {
  //console.log('Ingresó a /crearProducto');
  let nombre = req.body.nombre;
  let descripcion = req.body.descripcion;
  let URLImage = '';
  let imagen = req.body.imagen;
  let precio = req.body.precio;
  let cantidad = req.body.cantidad;

  //console.log('nombre ' + nombre);

  conn.query(
    "INSERT INTO producto (nombre, descripcion, URLImage, imagen,precio,cantidad) VALUES (?,?,?,?,?,?);",
    [nombre, descripcion, URLImage, imagen.replace("'","''"), precio, cantidad],
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

const AWS_PUBLIC_KEY = '';
const AWS_SECRET_KEY = '';
const AWS_BUCKET_NAME = 'tallerintermedias';
const AWS_BUCKET_REGION = 'us-west-2';

const client = new AWS.S3({ 
  region: AWS_BUCKET_REGION,  
  credentials:{
      accessKeyId: AWS_PUBLIC_KEY,
      secretAccessKey: AWS_SECRET_KEY
  }
});

app.post("/crearProductoS3", function (req, res) {

  /* Carga imagen a AWS S3 */
  var buf = new Buffer(req.body.imagen,'base64');
  var params = {
    Key: req.body.nombreImagen, 
    Body: buf,
    Bucket: AWS_BUCKET_NAME,
    ContentEncoding: 'base64',
    ContentType: 'image/jpg'
  };
  client.putObject(params, function(err, data){
      if (err) { 
        console.log(err);
        console.log('Error uploading data: ', data); 
      } else {
        console.log(data);
        console.log('succesfully uploaded the image!');
        /* Inserción tabla */
        let nombre = req.body.nombre;
        let descripcion = req.body.descripcion;
        let URLImage = `https://${params.Bucket}.s3.us-west-2.amazonaws.com/${params.Key}`;
        let imagen = req.body.imagen;
        let precio = req.body.precio;
        let cantidad = req.body.cantidad;

        console.log(URLImage + " url ");
        conn.query(
          "INSERT INTO producto (nombre, descripcion, URLImage, imagen,precio,cantidad) VALUES (?,?,?,?,?,?);",
          [nombre.replace("'","''"), descripcion.replace("'","''"), URLImage, imagen.replace("'","''"), precio, cantidad],
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
      }
  });  
});

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
