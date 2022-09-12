import React from 'react';
import { useCart } from 'react-use-cart';

export const Item = (props) => {
    const { addItem } = useCart();

  return (
    <div className='col-11 col-md-6 col-lg-3 ms-0 mb-4'>
        <div className="card p-0 overflow-hidden h-10 shadow">
        <img src={props.img} className="card-img-top img-fluid" alt="Producto" style={{width:'18rem', height:'18rem'}} />
        <div className="card-body text-center">
            <h5 className="card-title">{props.name}</h5>
            <h5 className="card-title">Q {props.price}</h5>
            <h6 className="card-title">{props.quantity} disponible(s)</h6>
            <p className="card-text">{props.description}</p>            
            <button className="btn btn-success" 
                onClick={() => addItem(props.item)}
                >Agregar a la cesta</button>
        </div>
        </div>
    </div>
  )
}

export default Item