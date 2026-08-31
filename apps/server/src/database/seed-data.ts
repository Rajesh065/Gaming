import { InMemoryDB } from './db.js';

console.log('⚡ [Seed] Initializing rich NexusPlay database fixtures...');
const db = InMemoryDB.getInstance();

console.log(`✅ [Seed] Created ${db.store.items.size} Game Items.`);
console.log(`✅ [Seed] Created ${db.store.users.size} Demo Player Accounts (Admin + Players).`);
console.log(`✅ [Seed] Created ${db.store.clans.size} Clans & Guilds.`);
console.log(`✅ [Seed] Created ${db.store.tournaments.size} Live Tournaments.`);
console.log(`✨ Seed successfully initialized! Ready for production deployment.`);
