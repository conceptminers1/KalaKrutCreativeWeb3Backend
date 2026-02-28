
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicApiPath = path.join(__dirname, '..', 'public', 'api');

// --- Mock Data Definitions ---

const transactions = [{ id: "T001", date: "2024-07-29T10:00:00.000Z", description: "Artist Grant awarded to @CreativeGeniu", amount: 500.00, currency: "USD", status: "Completed", from: "KalaKrut Treasury", to: "user-artist-123" }];
const treasury_transactions = [{ id: "T001", date: "2024-07-29T10:00:00.000Z", description: "Artist Grant awarded to @CreativeGeniu", amount: 500.00, currency: "USD", status: "Completed", from: "KalaKrut Treasury", to: "user-artist-123" }];
const artists = [{ id: "A001", name: "DJ Sparkle", genre: "Electronic", contact: "sparkle@email.com", rating: 5 }];
const sponsors = [{ id: "S001", name: "SynthWave Productions", industry: "Music Production", contact: "contact@synthwave.com", package: "Gold" }];
const revellers = [{ id: "R001", name: "Festival Fanatic", memberSince: "2023-01-15", contact: "fanatic@email.com", interests: ["Techno", "House"] }];
const marketplace_items = [{ id: "M001", name: "Vintage Synth", seller: "SynthSeller", price: 1200, currency: "USD", type: "instrument" }];
const forum_posts = [{ id: "F001", title: "Best venues in Ibiza?", author: "ClubHopper", replies: 15, lastPost: "2024-07-28T18:00:00.000Z" }];
const roster_bookings = [{ id: "RB001", artist: "DJ Sparkle", event: "Summer Fest", date: "2024-08-15", status: "Confirmed" }];

const dataFiles = {
  'transactions.json': transactions,
  'treasury_transactions.json': treasury_transactions,
  'artists.json': artists,
  'sponsors.json': sponsors,
  'revellers.json': revellers,
  'marketplace.json': marketplace_items,
  'forum.json': forum_posts,
  'roster-bookings.json': roster_bookings,
};

(async () => {
  try {
    await mkdir(publicApiPath, { recursive: true });
    for (const [fileName, data] of Object.entries(dataFiles)) {
      await writeFile(path.join(publicApiPath, fileName), JSON.stringify(data, null, 2));
      console.log(`Successfully generated ${fileName}`);
    }
    console.log('All mock data files generated successfully.');
  } catch (error) {
    console.error('Error generating data:', error);
    process.exit(1);
  }
})();
