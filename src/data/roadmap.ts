export const PRELIMS_EXAM = '2027-05-23';

export interface CycleRoadmap {
  number: number;
  title: string;
  dateRange: string;
  upscFocus: string;
  alertowlsMilestone: string;
  physicalMusic: string;
  milestones: { date: string; label: string }[];
  weeklyTopics: string[];
}

export const CYCLE_ROADMAP: CycleRoadmap[] = [
  {
    number: 1,
    title: 'Constitutional Framework + Ingestion Engine',
    dateRange: 'Sep 28 – Oct 25, 2026',
    upscFocus: 'Polity (Laxmikanth): Constitution, Preamble, FRs, DPSP, Amendments',
    alertowlsMilestone: 'Ingestion Engine v1 — core alert pipeline',
    physicalMusic: '5 strict dead-hang pull-ups baseline',
    milestones: [],
    weeklyTopics: [
      'W1: Preamble, Citizenship, Fundamental Rights I',
      'W2: FRs II, DPSP, Fundamental Duties',
      'W3: Parliament, Executive, Judiciary',
      'W4: Federalism, Local Govt, Constitutional Bodies',
    ],
  },
  {
    number: 2,
    title: 'Birthday Launch Checkpoint',
    dateRange: 'Oct 26 – Nov 22, 2026',
    upscFocus: 'Union Executive + Modern History Intro (Spectrum)',
    alertowlsMilestone: 'Nov 2: 25 users, 1 song recorded',
    physicalMusic: 'Riyaz daily + evening strikes',
    milestones: [{ date: '2026-11-02', label: '25 users · 1 song recorded' }],
    weeklyTopics: [
      'W1: President, PM, Council of Ministers',
      'W2: Modern History: 1857 – Congress Phase',
      'W3: Non-Cooperation & Civil Disobedience',
      'W4: Quit India & Post-War Nationalism',
    ],
  },
  {
    number: 3,
    title: 'Modern History Movement',
    dateRange: 'Nov 23 – Dec 20, 2026',
    upscFocus: 'Spectrum Modern India — movements & personalities',
    alertowlsMilestone: '75 paying users',
    physicalMusic: 'Badminton endurance blocks',
    milestones: [],
    weeklyTopics: [
      'W1: Revolutionary movements',
      'W2: Gandhi era consolidation',
      'W3: Partition & integration',
      'W4: PYQ marathon — Modern History',
    ],
  },
  {
    number: 4,
    title: 'Economy Part 1 + Leave Bank Week 1',
    dateRange: 'Dec 21, 2026 – Jan 17, 2027',
    upscFocus: 'Banking, Inflation, Monetary Policy',
    alertowlsMilestone: '100 users (~$1.5k MRR)',
    physicalMusic: 'Weight band 64.0–64.5 kg',
    milestones: [],
    weeklyTopics: [
      'W1: National Income & Growth',
      'W2: Banking & RBI',
      'W3: Inflation & Fiscal Policy',
      'W4: Budget & Economic Survey highlights',
    ],
  },
  {
    number: 5,
    title: 'Economy Part 2 & Physical Geography',
    dateRange: 'Jan 18 – Feb 14, 2027',
    upscFocus: 'Economic development + Indian geography',
    alertowlsMilestone: '200 users (₹1 Cr exit baseline)',
    physicalMusic: '12+ pull-ups target',
    milestones: [],
    weeklyTopics: [
      'W1: Agriculture & food security',
      'W2: Industry & infrastructure',
      'W3: Climate, monsoon, resources',
      'W4: Mapping & location PYQs',
    ],
  },
  {
    number: 6,
    title: 'Environment & Biodiversity',
    dateRange: 'Feb 15 – Mar 14, 2027',
    upscFocus: 'PMF IAS Environment + conventions',
    alertowlsMilestone: '300 users',
    physicalMusic: 'Leave Bank Week 2',
    milestones: [],
    weeklyTopics: [
      'W1: Ecology basics & biodiversity',
      'W2: Climate change & India policy',
      'W3: Pollution & waste',
      'W4: Environmental institutions & acts',
    ],
  },
  {
    number: 7,
    title: 'Ancient/Medieval + CSAT Lock',
    dateRange: 'Mar 15 – Apr 11, 2027',
    upscFocus: 'Ancient & Medieval India + CSAT >95',
    alertowlsMilestone: '400 users (₹2.5–3 Cr valuation bracket)',
    physicalMusic: 'CSAT timed drills',
    milestones: [],
    weeklyTopics: [
      'W1: Ancient India — sources & culture',
      'W2: Medieval dynasties',
      'W3: CSAT comprehension & logic',
      'W4: CSAT quant speed tests',
    ],
  },
  {
    number: 8,
    title: 'Prelims 150+ Mock Marathon',
    dateRange: 'Apr 12 – May 9, 2027',
    upscFocus: '12 full Prelims mocks — 150+ target',
    alertowlsMilestone: 'Business on autopilot',
    physicalMusic: 'Taper — sleep priority',
    milestones: [],
    weeklyTopics: [
      'W1: Mocks 1–3 + error log',
      'W2: Mocks 4–6 + weak areas',
      'W3: Mocks 7–9 + revision',
      'W4: Mocks 10–12 + light review',
    ],
  },
  {
    number: 9,
    title: 'Peak Taper & PRELIMS',
    dateRange: 'May 10 – May 23, 2027',
    upscFocus: 'PRELIMS EXAM May 23 — Target 150+',
    alertowlsMilestone: 'Minimal founder — exam mode',
    physicalMusic: 'Walks + riyaz only',
    milestones: [{ date: '2027-05-23', label: 'UPSC Prelims 2027' }],
    weeklyTopics: ['W1: Taper revision', 'W2: Exam week — execute'],
  },
  {
    number: 10,
    title: 'Post-Prelims Ethics & Essay',
    dateRange: 'May 24 – Jun 20, 2027',
    upscFocus: 'GS-4 Ethics + Essay masterclass',
    alertowlsMilestone: '4-day post-prelims leave',
    physicalMusic: 'Recovery + light sport',
    milestones: [],
    weeklyTopics: [
      'W1: Ethics thinkers & case studies',
      'W2: Essay structure & quotes bank',
      'W3: Answer writing — ethics',
      'W4: Full essay simulations',
    ],
  },
  {
    number: 11,
    title: 'Optional Subject Revision',
    dateRange: 'Jun 21 – Jul 18, 2027',
    upscFocus: 'Optional Papers 1 & 2 (500 marks backbone)',
    alertowlsMilestone: 'Founder 6h/week maintenance',
    physicalMusic: 'Maintain conditioning',
    milestones: [],
    weeklyTopics: [
      'W1: Optional Paper 1 themes',
      'W2: Optional Paper 2 themes',
      'W3: Cross-link with GS',
      'W4: Optional PYQ set',
    ],
  },
  {
    number: 12,
    title: 'GS 1–3 Answer Writing',
    dateRange: 'Jul 19 – Aug 15, 2027',
    upscFocus: 'Daily AW + judgments & committee templates',
    alertowlsMilestone: 'Outbound paused',
    physicalMusic: 'Stamina maintenance',
    milestones: [],
    weeklyTopics: [
      'W1: GS-1 AW daily',
      'W2: GS-2 AW + judgments',
      'W3: GS-3 AW + committees',
      'W4: Integrated AW + review',
    ],
  },
  {
    number: 13,
    title: 'Mains Simulation & EXAM',
    dateRange: 'Aug 16 – Mid-Sep 2027',
    upscFocus: '3-hour Mains tests + MAINS 2027 (AIR < 50)',
    alertowlsMilestone: '₹2.5 Cr exit trajectory lock',
    physicalMusic: 'Exam-week sleep protocol',
    milestones: [{ date: '2027-09-15', label: 'UPSC Mains 2027' }],
    weeklyTopics: [
      'W1: Full test 1–2',
      'W2: Full test 3–4',
      'W3: Full test 5 + Mains exam',
      'W4: Post-exam debrief',
    ],
  },
];

export function getNextMilestone(fromDate: string): { date: string; label: string } {
  const upcoming = CYCLE_ROADMAP.flatMap((c) => c.milestones)
    .filter((m) => m.date >= fromDate)
    .sort((a, b) => a.date.localeCompare(b.date));
  return upcoming[0] ?? { date: PRELIMS_EXAM, label: 'UPSC Prelims 2027' };
}
