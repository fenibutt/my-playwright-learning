type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

const laptop: Product = {
  name: "Laptop",
  price: 999.99,
  inStock: true,
};

const headphones: Product = {
  name: "Headphones",
  price: 49.99,
  inStock: false,
};

const headphones2: Product = {
  name: "Headphones",
  price: 49.99,
  inStock: false,
};

function formatPrice(price: number): string {
  return `$${price}`;
}
