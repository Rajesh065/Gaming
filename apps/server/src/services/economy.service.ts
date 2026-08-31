import { InMemoryDB } from '../database/db.js';
import { GameItem, InventorySlot, ItemRarity, LootBoxDrop } from '@nexusplay/shared-types';

export class EconomyService {
  private db = InMemoryDB.getInstance();

  public getCatalog(): GameItem[] {
    return Array.from(this.db.store.items.values());
  }

  public getInventory(userId: string): InventorySlot[] {
    const slots: InventorySlot[] = [];
    for (const inv of this.db.store.inventory.values()) {
      if (inv.userId === userId) {
        const item = this.db.store.items.get(inv.itemId);
        if (item) {
          slots.push({
            id: inv.id,
            userId: inv.userId,
            itemId: inv.itemId,
            item,
            quantity: inv.quantity,
            durabilityCurrent: inv.durability,
            isEquipped: inv.isEquipped,
            acquiredAt: new Date().toISOString()
          });
        }
      }
    }
    return slots;
  }

  public purchaseItem(userId: string, itemId: string, currencyType: 'gold' | 'nexusCrystals'): InventorySlot {
    const user = this.db.store.users.get(userId);
    const item = this.db.store.items.get(itemId);
    if (!user || !item) throw new Error('User or item not found');

    const cost = currencyType === 'gold' ? item.basePriceGold : item.basePriceCrystals;
    if (user.currency[currencyType] < cost) {
      throw new Error(`Insufficient ${currencyType}`);
    }

    user.currency[currencyType] -= cost;

    const invId = `inv-${userId}-${Date.now()}`;
    const newInv = {
      id: invId,
      userId,
      itemId,
      quantity: 1,
      durability: 100,
      isEquipped: false
    };

    this.db.store.inventory.set(invId, newInv);

    return {
      id: invId,
      userId,
      itemId,
      item,
      quantity: 1,
      durabilityCurrent: 100,
      isEquipped: false,
      acquiredAt: new Date().toISOString()
    };
  }

  public openLootBox(userId: string): LootBoxDrop {
    const user = this.db.store.users.get(userId);
    if (!user) throw new Error('User not found');

    const boxCost = 250;
    if (user.currency.gold < boxCost) {
      throw new Error('Insufficient gold to open Loot Box');
    }
    user.currency.gold -= boxCost;

    const items = Array.from(this.db.store.items.values());
    const roll = Math.random();
    let selectedItem: GameItem;
    let isJackpot = false;

    if (roll > 0.9) {
      selectedItem = items.find((i) => i.rarity === ItemRarity.MYTHIC) || items[0];
      isJackpot = true;
    } else if (roll > 0.6) {
      selectedItem = items.find((i) => i.rarity === ItemRarity.LEGENDARY || i.rarity === ItemRarity.EPIC) || items[0];
    } else {
      selectedItem = items.find((i) => i.rarity === ItemRarity.RARE || i.rarity === ItemRarity.UNCOMMON || i.rarity === ItemRarity.COMMON) || items[0];
    }

    const invId = `inv-${userId}-${Date.now()}`;
    this.db.store.inventory.set(invId, {
      id: invId,
      userId,
      itemId: selectedItem.id,
      quantity: 1,
      durability: 100,
      isEquipped: false
    });

    return {
      item: selectedItem,
      quantity: 1,
      rarity: selectedItem.rarity,
      isJackpot
    };
  }
}
