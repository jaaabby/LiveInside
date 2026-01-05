import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

export interface Cart {
  id: string;
  clientName: string;
  items: CartItem[];
}

interface CartState {
  carts: Cart[];
  activeCartId: string | null;
  addItem: (cartId: string, product: Product, quantity?: number) => void;
  removeItem: (cartId: string, productId: string) => void;
  updateQuantity: (cartId: string, productId: string, quantity: number) => void;
  clearCart: (cartId: string) => void;
  getTotal: (cartId: string) => number;
  getCartItems: (cartId: string) => CartItem[];
  setActiveCart: (cartId: string) => void;
}

// Carritos predefinidos
const initialCarts: Cart[] = [
  { id: 'cart-1', clientName: 'Juan Pérez', items: [] },
  { id: 'cart-2', clientName: 'María González', items: [] },
];

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      carts: initialCarts,
      activeCartId: 'cart-1',
      addItem: (cartId, product, quantity = 1) =>
        set((state) => {
          const updatedCarts = state.carts.map((cart) => {
            if (cart.id !== cartId) return cart;
            
            const existingItem = cart.items.find(
              (item) => item.product.id === product.id
            );
            
            if (existingItem) {
              return {
                ...cart,
                items: cart.items.map((item) =>
                  item.product.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
              };
            }
            
            return { ...cart, items: [...cart.items, { product, quantity }] };
          });
          
          return { carts: updatedCarts };
        }),
      removeItem: (cartId, productId) =>
        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.id === cartId
              ? {
                  ...cart,
                  items: cart.items.filter((item) => item.product.id !== productId),
                }
              : cart
          ),
        })),
      updateQuantity: (cartId, productId, quantity) =>
        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.id === cartId
              ? {
                  ...cart,
                  items: cart.items.map((item) =>
                    item.product.id === productId ? { ...item, quantity } : item
                  ),
                }
              : cart
          ),
        })),
      clearCart: (cartId) =>
        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.id === cartId ? { ...cart, items: [] } : cart
          ),
        })),
      getTotal: (cartId) => {
        const { carts } = get();
        const cart = carts.find((c) => c.id === cartId);
        if (!cart) return 0;
        return cart.items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      getCartItems: (cartId) => {
        const { carts } = get();
        const cart = carts.find((c) => c.id === cartId);
        return cart?.items || [];
      },
      setActiveCart: (cartId) => set({ activeCartId: cartId }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
