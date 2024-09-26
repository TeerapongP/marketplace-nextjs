import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, CartState } from '../interface/carts';

// Define action types
type Action =
    | { type: 'SET_CART_ITEMS'; payload: CartItem[] }
    | { type: 'ADD_TO_CART'; payload: CartItem }
    | { type: 'REMOVE_FROM_CART'; payload: number };

// Initial state
export const initialState: CartState = {
    cartItems: [],
};

// Reducer function
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
                cartItems: state.cartItems.filter(item => item.cartsId !== action.payload),
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

// Provider Component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Fetch Cart Items from API
    const fetchCartItems = async () => {
        const token = localStorage.getItem('token'); // Replace with your auth handling
        const userId = localStorage.getItem('userId'); // Replace with your auth handling

        try {
            const response = await fetch(`/api/carts/fetch?userId=${userId}`, { // Use template literal here
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data: CartItem[] = await response.json();
                dispatch({ type: 'SET_CART_ITEMS', payload: data });
            } else {
                ('Error fetching cart items');
            }
        } catch (error) {
            ('Error fetching cart items:', error);
        }
    };

    useEffect(() => {
        fetchCartItems(); // Fetch items on component mount
    }, []);


    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook for accessing cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
