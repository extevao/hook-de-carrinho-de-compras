import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    return getCartLocalStorage();
  });

  function getCartLocalStorage(): Product[] {
    const storagedCart = localStorage.getItem('@RocketShoes:cart') as string

    return storagedCart ? JSON.parse(storagedCart) : []
  }

  function saveCart(newCart: Product[]) {
    setCart(newCart)
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
  }

  function saveProductInLocalStorage(newProduct: Product) {
    const productInCart = cart.some(product => product.id === newProduct.id)

    if (productInCart) {
      saveCart(cart.map(product => {
        return product.id === newProduct.id
          ? { ...product, amount: product.amount + newProduct.amount }
          : product
      }))

      return
    }

    saveCart([...cart, newProduct])
  }

  const addProduct = async (productId: number) => {
    try {
      const { data: product } = await api.get<Product>(`products/${productId}`)

      saveProductInLocalStorage({ ...product, amount: 1 })
    } catch {
      // TODO
      toast.error('Erro na adição do produto')

    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
