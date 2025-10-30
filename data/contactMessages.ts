import { ContactMessage } from '../types';

export const contactMessagesData: ContactMessage[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Question about my order #BFX-002',
    message: "Hello, I was wondering if I could get a tracking number for my recent order. I'm very excited to receive my new WatchFit 2! Thanks.",
    date: '2023-10-30',
    status: 'Unread',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.s@example.com',
    subject: 'Bulk Purchase Inquiry',
    message: "Hi, I'm interested in purchasing 20 units of the Powerank 20K for my company. Do you offer any corporate discounts or bulk pricing? Please let me know.",
    date: '2023-10-29',
    status: 'Unread',
  },
  {
    id: 3,
    name: 'Sam Wilson',
    email: 'sam.wilson@example.com',
    subject: 'Feature Request for FreePods Pro',
    message: "I love my FreePods Pro, but it would be amazing if you could add multi-point bluetooth connection in a future firmware update. Is this something you are considering?",
    date: '2023-10-28',
    status: 'Read',
  },
  {
    id: 4,
    name: 'Peter Parker',
    email: 'p.parker@example.com',
    subject: 'Issue with my speaker',
    message: 'My BoomBass speaker is not turning on. I have tried charging it overnight but nothing seems to work. Can I get a replacement?',
    date: '2023-10-27',
    status: 'Archived',
  },
];