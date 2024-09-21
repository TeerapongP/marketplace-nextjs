import React, { createContext, useContext, useReducer } from 'react';
import { CartItem, CartState } from '../interface/carts';
// Define action types
type Action =
    | { type: 'SET_CART_ITEMS'; payload: CartItem[] }
    | { type: 'ADD_TO_CART'; payload: CartItem }
    | { type: 'REMOVE_FROM_CART'; payload: number };

// Create initial state
export const initialState: CartState = {
    cartItems: [],
};

// Create a reducer function
const cartReducer = (state: CartState, action: Action): CartState => {
    switch (action.type) {
        case 'SET_CART_ITEMS':
            return { ...state, cartItems: action.payload };
        case 'ADD_TO_CART':
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload],
            };
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.productId !== action.payload),
            };
        default:
            return state;
    }
};

// Create context
export const CartContext = createContext<{
    state: CartState;
    dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Create a provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

// Create a custom hook for easy access to the context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
