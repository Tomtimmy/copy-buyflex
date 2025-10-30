
import { ContactMessage } from '../types';

export const contactMessagesData: ContactMessage[] = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.d@example.com',
        subject: 'Question about FreePods Pro',
        message: 'I was wondering if the FreePods Pro are compatible with Android devices. I couldn\'t find the information on the product page. Thanks!',
        date: '2023-10-28',
        status: 'New',
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.s@example.com',
        subject: 'Issue with my recent order (BFX-002)',
        message: 'Hi, my order BFX-002 shows as shipped but the tracking number isn\'t working. Can you please look into this for me?',
        date: '2023-10-29',
        status: 'Read',
    },
    {
        id: 3,
        name: 'Peter Jones',
        email: 'peter.j@example.com',
        subject: 'Bulk Order Inquiry',
        message: 'I am interested in purchasing 50 units of the Powerank 20K for my company. Do you offer corporate discounts? Please let me know.',
        date: '2023-10-30',
        status: 'Archived',
    },
     {
        id: 4,
        name: 'Emily White',
        email: 'emily.w@example.com',
        subject: 'Return Request',
        message: 'I would like to return the BoomBass Speaker I purchased. It\'s unopened. What is the process for returns?',
        date: '2023-11-01',
        status: 'New',
    }
];
