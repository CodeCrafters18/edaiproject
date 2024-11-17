import React, { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(currentCart => {
            const existingProduct = currentCart.find(p => p.id === product.id);
            if (existingProduct) {
                return currentCart.map(p => 
                    p.id === product.id ? { ...p, qty: p.qty + 1 } : p
                );
            } else {
                return [...currentCart, { ...product, qty: 1 }];
            }
        });
    };

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartContextProvider");
    }
    return context;
};

export default CartContext;