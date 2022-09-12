import React from 'react';
import Item from './Item';
//import data from './data';
import Cesta from './Cesta';
import { CartProvider } from 'react-use-cart';
import { useState, useEffect } from 'react';
import axios from "axios";

export const Tienda = () => {
  //console.warn(data.productData);
  const [datosAPI, setDatosAPI] = useState([]);
  var dataPrueba =[];
  var data = [];
  var primerRender = true;

  React.useEffect(() => {
    axios.get('http://127.0.0.1:3000/obtenerProducto').then((response) => {
      if(primerRender){
      dataPrueba = response.data;
      dataPrueba.forEach(element => {                      
                        var nuevaImagen =  (element.imagen.data).reduce((data, byte) => data + String.fromCharCode(byte), '');
                        var nuevoProducto = { //Se agrega un objeto con las propiedades que react-use-cart requiere 
                          id : element.idProducto,
                          img : 'data:image/png;base64,'+ nuevaImagen,
                          name : element.nombre,
                          description : element.descripcion,
                          price : element.precio,
                          quantity : element.cantidad
                        };
                        data.push(nuevoProducto);                      
                      });  
      setDatosAPI(data);
      primerRender = false; 
      }             
    });
  }, []);


  return (
    <>
    
      <CartProvider>
        <h1 className="text-center mt-3">Productos</h1>
        <section className="py-4 container">          
          <div className="row justify-content-center">
            {
              datosAPI.map((item, index) => {
                return(
                  <Item                     
                    img={item.img} 
                    name={item.name}                   
                    description={item.description} 
                    price={item.price} 
                    quantity={item.quantity}                    
                    item={item}                 
                    key={index}
                  />
                )
              })
            }
            <Cesta />
          </div> 
        </section>
      </CartProvider>
    </>
  )
}
