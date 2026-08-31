import React, { useState } from 'react';
import { GameItem, ItemRarity, ItemType, UserProfile } from '@nexusplay/shared-types';
import { soundFx } from '../components/AudioSynthesizer';
import { ShoppingBag, Box, Sparkles, Check, Flame, Shield, Zap } from 'lucide-react';

interface StorePageProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
}

export const StorePage: React.FC<StorePageProps> = ({ user, onUpdateUser }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isOpeningBox, setIsOpeningBox] = useState(false);
  const [lootResult, setLootResult] = useState<GameItem | null>(null);

  const storeItems: GameItem[] = [
    {
      id: 'item-1',
      name: 'Apex Cyber Runner V1',
      description: 'Aerodynamic carbon-fiber racing chassis with neon cyan underglow.',
      type: ItemType.VEHICLE_CHASSIS,
      rarity: ItemRarity.LEGENDARY,
      icon: '🏎️',
      basePriceGold: 2500,
      basePriceCrystals: 50,
      tradable: true,
      attributes: { speedBoost: 25, acceleration: 15, handling: 20 },
      requiredLevel: 5
    },
    {
      id: 'item-2',
      name: 'Plasma Ion Thruster',
      description: 'High-thrust afterburner providing instant speed surges.',
      type: ItemType.VEHICLE_BOOSTER,
      rarity: ItemRarity.EPIC,
      icon: '🚀',
      basePriceGold: 1200,
      basePriceCrystals: 20,
      tradable: true,
      attributes: { speedBoost: 35, acceleration: 40 },
      requiredLevel: 3
    },
    {
      id: 'item-3',
      name: 'Quantum Particle Blaster',
      description: 'Fires high-velocity ionized plasma bolts with 25% crit bonus.',
      type: ItemType.WEAPON_BLASTER,
      rarity: ItemRarity.MYTHIC,
      icon: '⚡',
      basePriceGold: 5000,
      basePriceCrystals: 100,
      tradable: true,
      attributes: { damage: 85, critChanceBonus: 0.25 },
      requiredLevel: 10
    },
    {
      id: 'item-4',
      name: 'Shadow Katana of Void',
      description: 'Forged from dark matter, bypasses 30% of enemy armor.',
      type: ItemType.WEAPON_MELEE,
      rarity: ItemRarity.EPIC,
      icon: '🗡️',
      basePriceGold: 1800,
      basePriceCrystals: 30,
      tradable: true,
      attributes: { damage: 65, critChanceBonus: 0.15 },
      requiredLevel: 4
    },
    {
      id: 'item-5',
      name: 'Aegis Force Barrier',
      description: 'Hard-light kinetic shield absorbing 45 base incoming damage.',
      type: ItemType.ARMOR_SHIELD,
      rarity: ItemRarity.RARE,
      icon: '🛡️',
      basePriceGold: 800,
      basePriceCrystals: 15,
      tradable: true,
      attributes: { defense: 45 },
      requiredLevel: 2
    },
    {
      id: 'item-6',
      name: 'Cyber Hologram Visor',
      description: 'Augmented reality cosmetic visor with custom glow particles.',
      type: ItemType.AVATAR_COSMETIC,
      rarity: ItemRarity.UNCOMMON,
      icon: '🥽',
      basePriceGold: 300,
      basePriceCrystals: 5,
      tradable: true,
      attributes: {},
      requiredLevel: 1
    }
  ];

  const handleBuy = (item: GameItem) => {
    if (user.currency.gold < item.basePriceGold) {
      alert('Not enough gold to purchase this item!');
      return;
    }

    soundFx.playPowerUp();
    const updated = {
      ...user,
      currency: {
        ...user.currency,
        gold: user.currency.gold - item.basePriceGold
      }
    };
    onUpdateUser(updated);
    alert(`🎉 Successfully acquired [${item.name}]!`);
  };

  const handleOpenLootBox = () => {
    if (user.currency.gold < 250) {
      alert('You need 250 Gold to open a Cyber Loot Crate!');
      return;
    }

    soundFx.playLaser();
    setIsOpeningBox(true);
    setLootResult(null);

    setTimeout(() => {
      soundFx.playPowerUp();
      const randItem = storeItems[Math.floor(Math.random() * storeItems.length)];
      setLootResult(randItem);
      setIsOpeningBox(false);

      const updated = {
        ...user,
        currency: {
          ...user.currency,
          gold: user.currency.gold - 250
        }
      };
      onUpdateUser(updated);
    }, 1800);
  };

  const filtered = filterType === 'ALL'
    ? storeItems
    : storeItems.filter((i) => i.type === filterType);

  const getRarityBadge = (rarity: ItemRarity) => {
    switch (rarity) {
      case ItemRarity.MYTHIC:
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case ItemRarity.LEGENDARY:
        return 'bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow/50';
      case ItemRarity.EPIC:
        return 'bg-cyber-purple/20 text-cyber-purple border-cyber-purple/50';
      case ItemRarity.RARE:
        return 'bg-cyber-neon/20 text-cyber-neon border-cyber-neon/50';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Loot Box Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-cyber-card via-[#151a2e] to-cyber-card border border-cyber-border p-8 rounded-3xl shadow-2xl flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-pink/15 border border-cyber-pink/40 rounded-full text-cyber-pink text-xs font-bold uppercase tracking-widest mb-3">
              <ShoppingBag className="w-3.5 h-3.5" /> Cyber Black Market
            </div>
            <h1 className="text-3xl sm:text-4xl font-black orbitron text-white mb-2">ARMORY & VIRTUAL STORE</h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
              Equip cutting-edge chassis, blasters, plasma boosters, and shields to dominate matches and boost your combat stats.
            </p>
          </div>

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-cyber-border/70 text-xs">
            <div>
              <span className="text-slate-400 block">Your Gold:</span>
              <strong className="text-xl font-bold orbitron text-cyber-yellow">💰 {user.currency.gold.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Your Nexus Crystals:</span>
              <strong className="text-xl font-bold orbitron text-cyber-neon">💎 {user.currency.nexusCrystals.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Interactive Loot Box Opener */}
        <div className="bg-cyber-card border border-cyber-neon/40 p-6 rounded-3xl shadow-2xl flex flex-col items-center text-center justify-between glow-cyan">
          <div>
            <span className="text-4xl mb-2 block animate-bounce">🎁</span>
            <h3 className="text-lg font-black orbitron text-white mb-1">CYBER CRATE DROP</h3>
            <p className="text-xs text-slate-400 mb-4">Roll for Mythic Blasters & Legendary Racing Chassis!</p>

            {isOpeningBox ? (
              <div className="py-4 text-cyber-neon font-bold text-sm animate-pulse">
                Decrypting Quantum Seal...
              </div>
            ) : lootResult ? (
              <div className="p-3 bg-cyber-dark rounded-xl border border-cyber-neon mb-4">
                <div className="text-2xl mb-1">{lootResult.icon}</div>
                <div className="text-xs font-bold text-white">{lootResult.name}</div>
                <span className={`text-[10px] px-2 py-0.5 rounded border mt-1 inline-block ${getRarityBadge(lootResult.rarity)}`}>
                  {lootResult.rarity}
                </span>
              </div>
            ) : null}
          </div>

          <button
            onClick={handleOpenLootBox}
            disabled={isOpeningBox}
            className="w-full py-3 bg-gradient-to-r from-cyber-neon to-cyber-blue text-black font-black uppercase text-xs tracking-wider rounded-xl hover:opacity-90 transition-all glow-cyan"
          >
            Open Crate (250 Gold)
          </button>
        </div>
      </div>

      {/* Catalog Filter Tabs */}
      <div className="flex gap-2 border-b border-cyber-border pb-3 overflow-x-auto">
        {['ALL', ItemType.VEHICLE_CHASSIS, ItemType.VEHICLE_BOOSTER, ItemType.WEAPON_BLASTER, ItemType.WEAPON_MELEE, ItemType.ARMOR_SHIELD, ItemType.AVATAR_COSMETIC].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === type
                ? 'bg-cyber-neon text-black font-black glow-cyan'
                : 'bg-cyber-dark text-slate-400 hover:text-white border border-cyber-border'
            }`}
          >
            {type.replace('VEHICLE_', '').replace('WEAPON_', '').replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Item Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-cyber-card border border-cyber-border hover:border-cyber-neon/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl p-3 bg-cyber-dark rounded-xl border border-cyber-border group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getRarityBadge(item.rarity)}`}>
                  {item.rarity}
                </span>
              </div>

              <h3 className="text-lg font-bold orbitron text-white mb-1 group-hover:text-cyber-neon transition-colors">
                {item.name}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">{item.description}</p>

              {/* Attributes Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.attributes.speedBoost && (
                  <span className="text-[11px] bg-cyber-neon/10 text-cyber-neon px-2 py-0.5 rounded font-mono">
                    +{item.attributes.speedBoost} Speed
                  </span>
                )}
                {item.attributes.damage && (
                  <span className="text-[11px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-mono">
                    +{item.attributes.damage} Damage
                  </span>
                )}
                {item.attributes.defense && (
                  <span className="text-[11px] bg-cyber-purple/10 text-cyber-purple px-2 py-0.5 rounded font-mono">
                    +{item.attributes.defense} Armor
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-cyber-border/70 flex items-center justify-between">
              <div>
                <div className="text-sm font-black orbitron text-cyber-yellow">💰 {item.basePriceGold}</div>
                <div className="text-[10px] text-cyber-neon">or 💎 {item.basePriceCrystals}</div>
              </div>

              <button
                onClick={() => handleBuy(item)}
                className="px-4 py-2 bg-cyber-neon text-black font-black uppercase text-xs tracking-wider rounded-xl hover:opacity-90 transition-all glow-cyan"
              >
                Purchase
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
