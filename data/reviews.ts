import { Review } from '../types';

export const reviewsData: Review[] = [
  // Product 1: FreePods Pro
  { id: 1, productId: 1, author: 'Alice J.', rating: 5, comment: "Absolutely amazing sound quality! The ANC is top-notch.", date: '2023-10-25', status: 'Approved' },
  { id: 2, productId: 1, author: 'GadgetGuru', rating: 4, comment: "Great for the price, but the case feels a bit cheap.", date: '2023-10-26', status: 'Approved' },
  { id: 3, productId: 1, author: 'Mike P.', rating: 5, comment: "These are the best earbuds I've ever owned!", date: '2023-10-28', status: 'Pending' },

  // Product 2: Powerank 20K
  { id: 4, productId: 2, author: 'Bob S.', rating: 5, comment: "This power bank is a beast! It lasts forever.", date: '2023-10-22', status: 'Approved' },
  { id: 5, productId: 2, author: 'TravelerTom', rating: 4, comment: "A bit heavy, but worth it for the capacity.", date: '2023-10-24', status: 'Approved' },
  { id: 6, productId: 2, author: 'Anonymous', rating: 1, comment: "Stopped working after a week.", date: '2023-10-29', status: 'Rejected' },

  // Product 3: WatchFit 2
  { id: 7, productId: 3, author: 'FitnessFanatic', rating: 5, comment: "Tracks my workouts perfectly. The screen is gorgeous.", date: '2023-10-20', status: 'Approved' },
  { id: 8, productId: 3, author: 'Diana P.', rating: 4, comment: "I wish the battery life was a little longer, but otherwise it's great.", date: '2023-10-21', status: 'Pending' },

  // Product 4: BoomBass Speaker
  { id: 9, productId: 4, author: 'PartyStarter', rating: 5, comment: "Loud, clear, and the bass is incredible for its size.", date: '2023-10-18', status: 'Approved' },
  { id: 10, productId: 4, author: 'BeachBum', rating: 3, comment: "It's waterproof which is cool but the connection can be spotty sometimes.", date: '2023-10-27', status: 'Pending' },

  // Product 5: ChargeFast Trio
  { id: 11, productId: 5, author: 'Techie Tina', rating: 5, comment: "So convenient to have one spot for all my devices.", date: '2023-10-15', status: 'Approved' },
  { id: 12, productId: 5, author: 'Minimalist Max', rating: 4, comment: "Works great, reduces clutter on my nightstand.", date: '2023-10-16', status: 'Approved' },

  // Product 6: Aero Headset
  { id: 13, productId: 6, author: 'Audiophile Andy', rating: 5, comment: "The sound stage is impressive for this price point. Very comfortable.", date: '2023-10-14', status: 'Approved' },
  { id: 14, productId: 6, author: 'Gamer Gail', rating: 4, comment: "Good for music, but the mic is just okay for gaming.", date: '2023-10-17', status: 'Pending' },
  
  // Product 7: CableWrap Kit
  { id: 15, productId: 7, author: 'NeatFreak Nick', rating: 5, comment: "My desk has never looked better. The magnets are strong.", date: '2023-10-12', status: 'Approved' },
  
  // Product 8: DriveMount Pro
  { id: 16, productId: 8, author: 'RoadWarrior Rita', rating: 5, comment: "Holds my phone securely even on bumpy roads.", date: '2023-10-11', status: 'Approved' },
];