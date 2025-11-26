export interface Product {
  id?: string;
  _id?: string;
  skuId?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  colors: string[];
  materials: string[];
  dimensions: {
    width: number;
    height: number;
  };
  tags: string[];
  bestseller?: boolean;
  rating: number;
  reviews: number;
  inStock: boolean;
  roomTypes: string[];
  zipCode: string;
  country: string;
  phone: string;
  sequence:string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedMaterial?: string;
  customDimensions?: {
    width: number;
    height: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'admin';
}

// export interface Product {
//   id?: string;
//   _id?: string;
//   name: string;
//   skuId: string;
//   price: number;
//   description?: string;
//   category?: string;
//   theme: string;
//   colors?: string[];
//   materials?: string[];
//   roomTypes?: string[];
//   bestseller?: boolean;
//   inStock?: boolean;
//   images?: string[];
//   [key: string]: any;
// }
//   zipCode: string;
//   country: string;
//   phone: string;
// }

export interface WallArt {
  id?: string;
  _id?: string;
  skuId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  colors: string[];
  materials: string[];
  dimensions: {
    width: number;
    height: number;
  };
  tags: string[];
  bestseller?: boolean;
  rating: number;
  reviews: number;
  inStock: boolean;
  roomTypes: string[];
  variants: WallArtVariant[];
}

export interface WallArtVariant {
  id: string;
  color: string;
  images: string[];
  price?: number;
  colorCode?: string;
}

export interface FilterOptions {
  category?: string;
  theme?: string;
  priceRange?: [number, number];
  colors?: string[];
  materials?: string[];
  roomTypes?: string[];
  inStock?: boolean;
}

export interface FilterOptions {
  category?: string;
  priceRange?: [number, number];
  colors?: string[];
  materials?: string[];
  roomTypes?: string[];
  inStock?: boolean;
}