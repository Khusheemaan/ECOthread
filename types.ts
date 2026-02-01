
export interface Garment {
  id: string;
  name: string;
  category: 'Top' | 'Bottom' | 'Outerwear' | 'Dress' | 'Accessory' | 'Footwear' | 'Other';
  fabric: string;
  color: string;
  brand?: string;
  style?: string; 
  imageUrl: string;
  story: GarmentStoryEvent[];
  originalOwner?: string;
  price?: string;
  type: 'Resell' | 'Swap';
  age?: string;
  repairs?: number;
}

export interface GarmentStoryEvent {
  date: string;
  type: 'Bought' | 'Repaired' | 'Swapped' | 'Sold' | 'Restyled';
  description: string;
  location?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  stylePreferences?: string[];
  avatar: string;
  currentLevel: number;
  phone?: string;
  dob?: string;
}

export interface CartItem extends Garment {
  quantity: number;
}

export interface TransitEvent {
  status: string;
  time: string;
  location: string;
  completed: boolean;
}

export interface Order {
  id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  price: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  type: 'Sale' | 'Purchase';
  counterparty: string;
  shippingAddress: string;
  trackingNumber: string;
  transitHistory: TransitEvent[];
}

export interface StylingTip {
  title: string;
  description: string;
  items: string[];
}

export interface RepairTutorial {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  time: string;
  steps: string[];
  videoThumbnail: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
}

export interface JourneyNode {
  id: number;
  title: string;
  description: string;
  type: 'Creator' | 'Merchant' | 'Recycler';
  status: 'locked' | 'active' | 'completed';
  icon: any;
}

export interface Reward {
  id: string;
  title: string;
  partner: string;
  image: string;
  unlockedAtLevel: number;
}
