import React from 'react';
import { useCart } from 'react-use-cart';

export default function Cesta() {
    const { 
        isEmpty,
        totalUniqueItems,
        items,
        totalItems,
        cartTotal,
        updateItemQuantity,
        removeItem,
        emptyCart
     } = useCart();
     
    if(isEmpty) return <h1 className='text-center'>La cesta está vacía</h1>
    
     return (
        <section className='py-4 container'>
            <div className='row justify-content-center'>
                <div className='col-12'>
                    <h5>Productos en la cesta: ({totalUniqueItems})</h5>
                    <h5>Total Items agregados a la cesta: ({totalItems})</h5>
                    <table className='table table-light table-hover m-0'>
                        <tbody>
                        {
                            items.map((item,index)=>{
                                return(
                                    <tr key={index}>
                                    <td>
                                        <img src={item.img} alt="" style={{height:'6rem'} }/>
                                    </td>
                                    <td>{item.name}</td>
                                    <td>Q {item.price}</td>
                                    <td><strong>Agregados</strong>: ({item.quantity})</td>
                                    <td>
                                        <button className='btn btn-info ms-2'
                                            onClick={()=>updateItemQuantity(item.id, item.quantity - 1)}>-
                                        </button>
                                        <button className='btn btn-info ms-2'
                                            onClick={()=>updateItemQuantity(item.id, item.quantity + 1)}>+
                                        </button>
                                        <button className='btn btn-danger ms-2'
                                            onClick={()=> removeItem(item.id)}>Eliminar
                                        </button>
                                    </td>
                                </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
                <div className='col-auto ms-auto'>
                    <h2>Total: Q. {cartTotal}</h2>
                </div>
                <div className='col-auto'>
                    <button 
                        className='btn btn-danger m-2'
                        onClick={()=> emptyCart()}>
                        Limpiar cesta
                    </button>
                    <button 
                        className='btn btn-primary m-2'
                        onClick={()=> emptyCart()}>
                        Pagar
                    </button>
                </div>
            </div>
        </section>
  )
}
