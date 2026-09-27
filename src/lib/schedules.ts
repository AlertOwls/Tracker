import { ScheduleArchetype, ScheduleItem } from './types';

export const SCHEDULE_ARCHETYPES: Record<ScheduleArchetype, { name: string; items: ScheduleItem[] }> = {
  'in-office': {
    name: 'In-Office Archetype (Mon, Wed, Thu)',
    items: [
      { id: 'io-1', time: '06:30 AM', title: 'Wake up & Hydrate', duration: '15m', category: 'health' },
      { id: 'io-2', time: '06:45 AM', title: 'Empty-Stomach Riyaz (Scales + Song + Guitar)', duration: '60m', category: 'leisure' },
      { id: 'io-3', time: '07:45 AM', title: 'Founder Block (Alertowls)', duration: '60m', category: 'work' },
      { id: 'io-4', time: '08:45 AM', title: 'Power Breakfast (Eggs + Shake)', duration: '30m', category: 'health' },
      { id: 'io-5', time: '09:15 AM', title: 'Shower & Ready', duration: '45m', category: 'routine' },
      { id: 'io-6', time: '10:00 AM – 08:00 PM', title: 'Office Block (Tiago commute in/out, 10:30–7:30 desk)', duration: '10h', category: 'work' },
      { id: 'io-7', time: '08:00 PM', title: 'Evening Strikes & Pull-ups', duration: '45m', category: 'health' },
      { id: 'io-8', time: '08:45 PM', title: 'High-Protein Dinner', duration: '30m', category: 'health' },
      { id: 'io-9', time: '09:15 PM', title: 'Call Hour (Parents/Friends)', duration: '60m', category: 'leisure' },
      { id: 'io-10', time: '10:15 PM', title: 'UPSC Static Reading', duration: '45m', category: 'study' },
      { id: 'io-11', time: '11:00 PM', title: 'Unbroken Sleep (7.5h)', duration: '7.5h', category: 'routine' },
    ],
  },
  'wfh': {
    name: 'WFH Archetype (Tue, Fri)',
    items: [
      { id: 'wfh-1', time: '06:00 AM', title: 'Wake up', duration: '15m', category: 'routine' },
      { id: 'wfh-2', time: '06:15 AM', title: 'Sports Block (Badminton + Swimming + Travel)', duration: '2h 45m', category: 'health' },
      { id: 'wfh-3', time: '09:00 AM', title: 'Post-Sports Breakfast & Shower', duration: '90m', category: 'health' },
      { id: 'wfh-4', time: '10:30 AM – 07:30 PM', title: 'WFH Office Sprint', duration: '9h', category: 'work' },
      { id: 'wfh-5', time: '07:30 PM', title: 'Social / Call Hour', duration: '60m', category: 'leisure' },
      { id: 'wfh-6', time: '08:30 PM', title: 'Dinner', duration: '30m', category: 'health' },
      { id: 'wfh-7', time: '09:00 PM', title: 'Founder Block (Alertowls)', duration: '60m', category: 'work' },
      { id: 'wfh-8', time: '10:00 PM', title: 'UPSC Static Reading', duration: '60m', category: 'study' },
      { id: 'wfh-9', time: '11:00 PM', title: 'Unbroken Sleep (7.0h)', duration: '7.0h', category: 'routine' },
    ],
  },
  'saturday': {
    name: 'Saturday Archetype',
    items: [
      { id: 'sat-1', time: '07:30 AM', title: 'Wake up & Riyaz', duration: '90m', category: 'leisure' },
      { id: 'sat-2', time: '09:00 AM', title: 'Alertowls War Room', duration: '4h', category: 'work' },
      { id: 'sat-3', time: '01:00 PM', title: 'Lunch', duration: '60m', category: 'health' },
      { id: 'sat-4', time: '02:00 PM', title: 'UPSC 150+ Deep Static & PYQs', duration: '3h', category: 'study' },
      { id: 'sat-5', time: '05:00 PM – 11:30 PM', title: 'Open Social Window (Guilt-free)', duration: '6h 30m', category: 'leisure' },
    ],
  },
  'sunday': {
    name: 'Sunday Archetype',
    items: [
      { id: 'sun-1', time: '06:30 AM', title: 'Morning Sports (Badminton + Swim)', duration: '3h', category: 'health' },
      { id: 'sun-2', time: '10:15 AM', title: 'Founder Growth/Outbound', duration: '3h', category: 'work' },
      { id: 'sun-3', time: '02:00 PM', title: 'UPSC Mock & CSAT', duration: '3h', category: 'study' },
      { id: 'sun-4', time: '05:00 PM', title: 'Life Admin (Boil 15 eggs, groceries, laundry)', duration: '90m', category: 'routine' },
      { id: 'sun-5', time: '06:30 PM', title: 'Chill, Dinner & Early 8h Sleep', duration: '8h', category: 'leisure' },
    ],
  },
};

export function getArchetypeForDate(date: Date): ScheduleArchetype {
  const day = date.getDay(); // 0 is Sun, 1 is Mon, ... 6 is Sat
  switch (day) {
    case 0:
      return 'sunday';
    case 1:
    case 3:
    case 4:
      return 'in-office';
    case 2:
    case 5:
      return 'wfh';
    case 6:
      return 'saturday';
    default:
      return 'in-office';
  }
}
