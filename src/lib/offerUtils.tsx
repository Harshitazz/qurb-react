import type { CartItem, Product } from '../types/index';

interface Offer {
  type: string;
  requiredProductId: string; // Using string because original IDs are stringified
  requiredQuantity: number;
  freeProductId: string;
  freeQuantity: number;
}

// Available offers
const OFFERS: Record<string, Offer> = {
  COCA_COLA: {
    type: "buy6get1",
    requiredProductId: "642",
    requiredQuantity: 6,
    freeProductId: "642",
    freeQuantity: 1,
  },
  CROISSANT_COFFEE: {
    type: "buy3get1coffee",
    requiredProductId: "532",
    requiredQuantity: 3,
    freeProductId: "641",
    freeQuantity: 1,
  },
};

export const calculateOffers = (
  cartItems: CartItem[],
  allProducts: Product[]
): CartItem[] => {
  const freeItems: CartItem[] = [];

  // Coca-Cola offer
  const cokeItems = cartItems.filter(
    (item) =>
      item.productId.toString() === OFFERS.COCA_COLA.requiredProductId && !item.isOffer
  );
  const totalCokeQuantity = cokeItems.reduce((sum, item) => sum + item.quantity, 0);

  const freeCokeCount = Math.floor(totalCokeQuantity / OFFERS.COCA_COLA.requiredQuantity);

  if (freeCokeCount > 0) {
    const cokeProduct = allProducts.find(
      (p) => p.id.toString() === OFFERS.COCA_COLA.requiredProductId
    );
    if (cokeProduct) {
      freeItems.push({
        productId: cokeProduct.id,
        name: cokeProduct.name,
        price: cokeProduct.price,
        image: cokeProduct.img,
        quantity: freeCokeCount,
        isOffer: true,
        offerType: OFFERS.COCA_COLA.type,
      });
    }
  }

  // Croissant + Coffee offer
  const croissantItems = cartItems.filter(
    (item) =>
      item.productId.toString() === OFFERS.CROISSANT_COFFEE.requiredProductId && !item.isOffer
  );
  const totalCroissantQuantity = croissantItems.reduce((sum, item) => sum + item.quantity, 0);

  const freeCoffeeCount = Math.floor(
    totalCroissantQuantity / OFFERS.CROISSANT_COFFEE.requiredQuantity
  );

  if (freeCoffeeCount > 0) {
    const coffeeProduct = allProducts.find(
      (p) => p.id.toString() === OFFERS.CROISSANT_COFFEE.freeProductId
    );

    if (coffeeProduct) {
      freeItems.push({
        productId: coffeeProduct.id,
        name: coffeeProduct.name,
        price: coffeeProduct.price,
        image: coffeeProduct.img,
        quantity: freeCoffeeCount,
        isOffer: true,
        offerType: OFFERS.CROISSANT_COFFEE.type,
      });
    }
  }

  console.log("✅ Final free items to add:", freeItems);

  return freeItems;
};

export const shouldRemoveFreeItem = (cartItems: CartItem[], freeItem: CartItem): boolean => {
  if (freeItem.offerType === OFFERS.COCA_COLA.type) {
    const cokeItems = cartItems.filter(
      (item) =>
        item.productId.toString() === OFFERS.COCA_COLA.requiredProductId && !item.isOffer
    );
    const totalCokeQuantity = cokeItems.reduce((sum, item) => sum + item.quantity, 0);
    const eligibleFreeItems = Math.floor(totalCokeQuantity / OFFERS.COCA_COLA.requiredQuantity);
    return eligibleFreeItems < freeItem.quantity;
  }

  if (freeItem.offerType === OFFERS.CROISSANT_COFFEE.type) {
    const croissantItems = cartItems.filter(
      (item) =>
        item.productId.toString() === OFFERS.CROISSANT_COFFEE.requiredProductId && !item.isOffer
    );
    const totalCroissantQuantity = croissantItems.reduce((sum, item) => sum + item.quantity, 0);
    const eligibleFreeItems = Math.floor(
      totalCroissantQuantity / OFFERS.CROISSANT_COFFEE.requiredQuantity
    );
    return eligibleFreeItems < freeItem.quantity;
  }

  return false;
};

export default OFFERS;
