import { LostFoundAdminItem } from '../types/lostFound';

export const initialMockLostFoundItems: LostFoundAdminItem[] = [
  {
    id: 'eec-lf-001',
    itemName: 'Casio fx-991EX ClassWiz Calculator',
    description:
      'Found under Table 4 in ECE Analog Lab 2. Name "Rahul K." scribbled on battery lid. Handed over to Lab Asst Mr. Murugan.',
    reportType: 'FOUND',
    location: 'ECE Analog Lab 2',
    contactName: 'Mr. Murugan (Lab Asst)',
    contactEmail: 'murugan.ece@easwari.ac.in',
    publicationStatus: 'Approved',
    createdAt: '2025-03-15T14:30:00Z',
    updatedAt: '2025-03-15T15:00:00Z',
  },
  {
    id: 'eec-lf-002',
    itemName: 'Dell 65W USB-C Laptop Charger',
    description:
      'Left in Central Library 2nd Floor Silent Study cubicle. Has green rubber band around cable. Handed over to Desk.',
    reportType: 'LOST',
    location: 'Central Library 2nd Floor',
    contactName: 'Library Help Desk',
    contactEmail: 'library@easwari.ac.in',
    publicationStatus: 'Approved',
    createdAt: '2025-03-14T11:00:00Z',
    updatedAt: '2025-03-14T11:30:00Z',
  },
  {
    id: 'eec-lf-003',
    itemName: 'Titan Steel Water Bottle (Navy Blue)',
    description:
      'Found in Mechanical Block Room 302 after Fluid Mechanics lecture. EEC sticker affixed to the side cap.',
    reportType: 'FOUND',
    location: 'Mech Block Rm 302',
    contactName: 'Student Affairs Desk',
    contactEmail: 'studentaffairs@eec.srmrmp.edu.in',
    publicationStatus: 'Approved',
    createdAt: '2025-03-16T09:15:00Z',
    updatedAt: '2025-03-16T09:30:00Z',
  },
];
