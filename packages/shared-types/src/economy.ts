export enum ItemRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
  MYTHIC = 'MYTHIC'
}

export enum ItemType {
  VEHICLE_CHASSIS = 'VEHICLE_CHASSIS',
  VEHICLE_BOOSTER = 'VEHICLE_BOOSTER',
  WEAPON_BLASTER = 'WEAPON_BLASTER',
  WEAPON_MELEE = 'WEAPON_MELEE',
  ARMOR_SHIELD = 'ARMOR_SHIELD',
  AVATAR_COSMETIC = 'AVATAR_COSMETIC',
  EMOTE = 'EMOTE',
  TITLE = 'TITLE',
  CONSUMABLE_POTION = 'CONSUMABLE_POTION',
  CRAFTING_MATERIAL = 'CRAFTING_MATERIAL'
}

export interface GameItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string;
  basePriceGold: number;
  basePriceCrystals: number;
  tradable: boolean;
  attributes: {
    speedBoost?: number;
    acceleration?: number;
    handling?: number;
    damage?: number;
    defense?: number;
    durabilityMax?: number;
    critChanceBonus?: number;
  };
  requiredLevel: number;
}

export interface InventorySlot {
  id: string;
  userId: string;
  itemId: string;
  item: GameItem;
  quantity: number;
  durabilityCurrent: number;
  isEquipped: boolean;
  equippedSlot?: string;
  acquiredAt: string;
}

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  sellerName: string;
  inventorySlotId: string;
  item: GameItem;
  quantity: number;
  priceGold?: number;
  priceCrystals?: number;
  expiresAt: string;
  createdAt: string;
  status: 'ACTIVE' | 'SOLD' | 'CANCELLED' | 'EXPIRED';
}

export interface LootBoxDrop {
  item: GameItem;
  quantity: number;
  rarity: ItemRarity;
  isJackpot: boolean;
}
