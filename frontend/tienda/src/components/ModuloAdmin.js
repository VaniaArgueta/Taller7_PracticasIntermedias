import React from 'react'
import { useRef, useState, useEffect } from 'react';
//import { useHistory } from 'react-router-dom';
import axios from "axios";
//import { useParams } from 'react-router';
//import { producto } from './producto';

export const ModuloAdmin = () => {

  const url = 'http://127.0.0.1:3000/crearProducto';

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [urlImage, setUrlImage] = useState(''); // url para S3
  const [imagen, setImagen] = useState('');
  /*const [imagen, setImagen] = useState({
    myFile: "",
  });*/
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');  
  
  const ref = useRef(null); 

  function onSubmit(e) {
    e.preventDefault();
    //console.log('base64');
    //console.log(imagen);

    axios
      .post(url, {
        nombre: nombre,
        descripcion: descripcion,
        imagen: imagen,
        precio: precio,
        cantidad:cantidad        
      })
      .then((response) => {
        console.log(response.data);
        alert('Producto agregado');
      }).error('Ocurrió un error inesperado');        
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file); 
    const imagenAux = base64.split(',');
    setImagen(imagenAux[1]); 
    //setImagen({ imagen, myFile: base64 });
  };
  
  return (
    <div className='contenedorFormulario'>
      <br />      
      <br />
      <form onSubmit={onSubmit} >
        <div className="mb-3">
          <label htmlFor="inputNombre" className="form-label">Nombre</label>
          <input type="text" 
                  className="form-control" id="inputNombre" 
                  value={ nombre }
                  onChange={ (e) => setNombre(e.target.value) }/>
        </div>
        <div className="mb-3">
          <label htmlFor="inputDescripcion" className="form-label">Descripción</label>
          <input type="text" 
                  className="form-control" id="inputDescripcion" 
                  value={ descripcion }
                  onChange={ (e) => setDescripcion(e.target.value) }/>
        </div>
        <div className="mb-3">
          <label htmlFor="inputImagen" className="form-label">URL Imagen</label>
          <div className="input-group mb-3">
            <input type="file" 
                  className="form-control" id="inputImagen" 
                  //value={ urlImage }
                  //onChange={ (e) => setUrlImage(e.target.value) }
                  //onChange={(e) => console.log(e.target.files[0])}
                  accept= ".jpeg, .png, .jpg"
                  onChange={handleFileUpload}/>
            
          </div>
          
        </div>
        <div className="mb-3">
          <label htmlFor="inputPrecio" className="form-label">Precio</label>
          <div className="input-group mb-3">
            <span className="input-group-text">Q</span>
            <input type="text" 
                  className="form-control" id="inputPrecio"
                  value={ precio }
                  onChange={ (e) => setPrecio(e.target.value) }/>
          </div>         
        </div>
        <div className="mb-3">
          <label htmlFor="inputCantidad" className="form-label">Cantidad</label>
          <input type="text" 
                  className="form-control" id="inputCantidad" 
                  value={ cantidad }
                  onChange={ (e) => setCantidad(e.target.value) }/>
        </div>
        
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>

  )

  
}
