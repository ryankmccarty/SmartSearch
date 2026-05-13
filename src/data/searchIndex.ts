export interface PageDoc {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  tags: string[];
  thumbnail: string;
  category: string;
  byline: string;
  readTime: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photoUrl: string;
  tags: string[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  hours: string;
  distance: string;
  tags: string[];
}

export interface CannedAnswer {
  queryMatch: string[];
  answer: string;
  citations: string[]; // Page IDs
  cta?: {
    label: string;
    url: string;
  };
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export const searchIndex: PageDoc[] = [
{
  id: 'p1',
  title: 'MRI Imaging Locations',
  url: '/locations/mri',
  excerpt:
  'Find a General Health MRI imaging center near you. We offer state-of-the-art 3T MRI, open MRI, and wide-bore MRI options for patient comfort and precise diagnostics.',
  tags: ['mri', 'imaging', 'locations', 'radiology', 'scan'],
  thumbnail:
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Imaging',
  byline: 'In Imaging Services',
  readTime: '3 min read',
  updatedAt: 'Updated 2d ago'
},
{
  id: 'p2',
  title: 'Schedule an Appointment',
  url: '/patients/schedule',
  excerpt:
  'Book your next appointment online. Schedule visits with primary care providers, specialists, or arrange for imaging and lab tests through our secure patient portal.',
  tags: ['schedule', 'appointment', 'booking', 'visit'],
  thumbnail:
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Patient Resources',
  byline: 'In Patient Care',
  readTime: '2 min read',
  updatedAt: 'Updated 5h ago'
},
{
  id: 'p3',
  title: 'Physical Therapy & Rehabilitation',
  url: '/services/physical-therapy',
  excerpt:
  'Our physical therapy clinics provide personalized rehabilitation programs to help you recover from injury, surgery, or manage chronic pain conditions.',
  tags: [
  'physical therapy',
  'rehab',
  'rehabilitation',
  'pt',
  'pain',
  'recovery'],

  thumbnail:
  'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Services',
  byline: 'In Rehabilitation',
  readTime: '4 min read',
  updatedAt: 'Updated 1w ago'
},
{
  id: 'p4',
  title: 'Urgent Care Centers',
  url: '/locations/urgent-care',
  excerpt:
  'Walk-in urgent care for non-life-threatening illnesses and injuries. Open 7 days a week with extended hours. View current wait times and save your spot online.',
  tags: [
  'urgent care',
  'walk in',
  'immediate care',
  'wait times',
  'minor injury',
  'chest pain'],

  thumbnail:
  'https://images.unsplash.com/photo-1538108149393-cebb47ac80bc?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Locations',
  byline: 'In Urgent Care',
  readTime: '2 min read',
  updatedAt: 'Updated 1h ago'
},
{
  id: 'p5',
  title: 'Primary Care Physicians',
  url: '/services/primary-care',
  excerpt:
  'Build a lasting relationship with a General Health primary care provider. We offer comprehensive care for the whole family, from preventive screenings to chronic disease management.',
  tags: [
  'primary care',
  'pcp',
  'family medicine',
  'doctor',
  'physician',
  'checkup'],

  thumbnail:
  'https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Specialty Care',
  byline: 'In Family Medicine',
  readTime: '5 min read',
  updatedAt: 'Updated 3d ago'
},
{
  id: 'p6',
  title: 'Billing & Insurance',
  url: '/patients/billing',
  excerpt:
  'Pay your bill online, understand your insurance coverage, and find financial assistance options. We accept most major health insurance plans including Medicare and Medicaid.',
  tags: ['billing', 'insurance', 'pay bill', 'financial', 'medicare', 'cost'],
  thumbnail:
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Patient Resources',
  byline: 'In Financial Services',
  readTime: '3 min read',
  updatedAt: 'Updated 2w ago'
},
{
  id: 'p7',
  title: 'MyChart Patient Portal',
  url: '/patients/mychart',
  excerpt:
  'Access your medical records, message your doctor, view test results, and manage your appointments through the secure MyChart patient portal.',
  tags: ['mychart', 'portal', 'records', 'test results', 'message doctor'],
  thumbnail:
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Patient Resources',
  byline: 'In Digital Health',
  readTime: '2 min read',
  updatedAt: 'Updated 1d ago'
},
{
  id: 'p8',
  title: 'Maternity Care & Delivery',
  url: '/services/maternity',
  excerpt:
  'Exceptional maternity care from prenatal visits to delivery and postpartum support. Tour our private birthing suites and meet our experienced OB/GYN team.',
  tags: ['maternity', 'pregnancy', 'baby', 'delivery', 'obgyn', 'birth'],
  thumbnail:
  'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Specialty Care',
  byline: "In Women's Health",
  readTime: '6 min read',
  updatedAt: 'Updated 4d ago'
},
{
  id: 'p9',
  title: 'Cardiology & Heart Care',
  url: '/services/heart',
  excerpt:
  'Nationally recognized heart and vascular care. Our cardiologists offer advanced treatments for heart disease, arrhythmias, and structural heart conditions.',
  tags: [
  'cardiology',
  'heart',
  'vascular',
  'cardiologist',
  'surgery',
  'chest pain',
  'angina',
  'heart attack'],

  thumbnail:
  'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Specialty Care',
  byline: 'In Cardiology',
  readTime: '5 min read',
  updatedAt: 'Updated 1w ago'
},
{
  id: 'p10',
  title: 'Emergency Room (ER) Wait Times',
  url: '/locations/emergency',
  excerpt:
  '24/7 emergency medical care for life-threatening conditions. View current ER wait times across all General Health hospital locations.',
  tags: [
  'emergency',
  'er',
  'wait times',
  'hospital',
  'trauma',
  'chest pain',
  'heart attack'],

  thumbnail:
  'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Locations',
  byline: 'In Emergency Care',
  readTime: '1 min read',
  updatedAt: 'Updated just now'
},
{
  id: 'p11',
  title: 'Orthopedics & Sports Medicine',
  url: '/services/orthopedics',
  excerpt:
  'Expert care for bone, joint, and muscle conditions. From joint replacement surgery to sports injury treatment, our orthopedic specialists get you moving again.',
  tags: [
  'orthopedics',
  'sports medicine',
  'joint',
  'bone',
  'surgery',
  'knee',
  'hip'],

  thumbnail:
  'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Specialty Care',
  byline: 'In Orthopedics',
  readTime: '4 min read',
  updatedAt: 'Updated 5d ago'
},
{
  id: 'p12',
  title: 'Careers at General Health',
  url: '/careers',
  excerpt:
  'Join our team of dedicated healthcare professionals. Explore job openings for nurses, physicians, allied health, and administrative roles.',
  tags: ['careers', 'jobs', 'hiring', 'employment', 'nursing'],
  thumbnail:
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Careers',
  byline: 'In Human Resources',
  readTime: '3 min read',
  updatedAt: 'Updated 2d ago'
},
{
  id: 'p13',
  title: "Pediatrics & Children's Health",
  url: '/services/pediatrics',
  excerpt:
  'Compassionate, kid-friendly care from newborn through adolescence. Our pediatricians provide well-child visits, vaccinations, and treatment for childhood illnesses.',
  tags: [
  'pediatrics',
  'children',
  'kids',
  'baby',
  'vaccinations',
  'pediatrician',
  'family medicine'],

  thumbnail:
  'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Specialty Care',
  byline: 'In Pediatrics',
  readTime: '4 min read',
  updatedAt: 'Updated 3d ago'
},
{
  id: 'p14',
  title: 'Dermatology & Skin Care',
  url: '/services/dermatology',
  excerpt:
  'Expert care for skin, hair, and nail conditions. Our dermatologists offer treatment for acne, eczema, psoriasis, skin cancer screenings, and cosmetic procedures.',
  tags: [
  'dermatology',
  'skin',
  'acne',
  'eczema',
  'psoriasis',
  'dermatologist',
  'cosmetic'],

  thumbnail:
  'https://images.unsplash.com/photo-1612776572997-76cc42e058c3?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Specialty Care',
  byline: 'In Dermatology',
  readTime: '4 min read',
  updatedAt: 'Updated 1w ago'
},
{
  id: 'p15',
  title: 'Mental & Behavioral Health',
  url: '/services/mental-health',
  excerpt:
  'Confidential support for anxiety, depression, and other mental health conditions. Our team includes psychiatrists, psychologists, and licensed therapists.',
  tags: [
  'mental health',
  'behavioral health',
  'anxiety',
  'depression',
  'therapy',
  'counseling',
  'psychiatry'],

  thumbnail:
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Specialty Care',
  byline: 'In Mental Health',
  readTime: '5 min read',
  updatedAt: 'Updated 4d ago'
},
{
  id: 'p16',
  title: 'Cancer Care & Oncology',
  url: '/services/oncology',
  excerpt:
  'Comprehensive cancer care including diagnosis, treatment, and survivorship support. Our oncology team offers chemotherapy, radiation, and clinical trials.',
  tags: [
  'cancer',
  'oncology',
  'chemotherapy',
  'radiation',
  'tumor',
  'oncologist'],

  thumbnail:
  'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Specialty Care',
  byline: 'In Oncology',
  readTime: '6 min read',
  updatedAt: 'Updated 2d ago'
},
{
  id: 'p17',
  title: 'Diabetes Care & Management',
  url: '/services/diabetes',
  excerpt:
  'Personalized diabetes management programs including endocrinology consultations, nutrition counseling, and continuous glucose monitoring support.',
  tags: [
  'diabetes',
  'endocrinology',
  'blood sugar',
  'insulin',
  'nutrition',
  'glucose'],

  thumbnail:
  'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Specialty Care',
  byline: 'In Endocrinology',
  readTime: '5 min read',
  updatedAt: 'Updated 6d ago'
},
{
  id: 'p18',
  title: 'Lab Services & Bloodwork',
  url: '/services/lab',
  excerpt:
  'Walk-in lab services for blood draws, urine tests, and specimen collection. View results securely through MyChart, usually within 24-48 hours.',
  tags: ['lab', 'bloodwork', 'blood test', 'lab work', 'specimen', 'results'],
  thumbnail:
  'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Services',
  byline: 'In Laboratory Services',
  readTime: '2 min read',
  updatedAt: 'Updated 1d ago'
},
{
  id: 'p19',
  title: 'Pharmacy Services',
  url: '/services/pharmacy',
  excerpt:
  'On-site pharmacies at most locations offer prescription fulfillment, medication counseling, and refills. Mail-order and home delivery available.',
  tags: ['pharmacy', 'prescription', 'medication', 'refill', 'drug', 'rx'],
  thumbnail:
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Services',
  byline: 'In Pharmacy',
  readTime: '3 min read',
  updatedAt: 'Updated 5d ago'
},
{
  id: 'p20',
  title: 'Telehealth & Virtual Visits',
  url: '/services/telehealth',
  excerpt:
  'Connect with your provider from home via secure video visits. Telehealth is available for many conditions including follow-ups, prescriptions, and minor illnesses.',
  tags: [
  'telehealth',
  'virtual visit',
  'video visit',
  'online',
  'remote',
  'appointment'],

  thumbnail:
  'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Services',
  byline: 'In Digital Health',
  readTime: '3 min read',
  updatedAt: 'Updated 2h ago'
},
{
  id: 'p21',
  title: 'Stroke Care & Neurology',
  url: '/services/stroke',
  excerpt:
  'Certified stroke center providing rapid response treatment for stroke, brain injury, and neurological conditions. Time-critical care saves lives.',
  tags: ['stroke', 'neurology', 'brain', 'neurologist', 'emergency'],
  thumbnail:
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Specialty Care',
  byline: 'In Neurology',
  readTime: '5 min read',
  updatedAt: 'Updated 1w ago'
},
{
  id: 'p22',
  title: 'Weight Loss & Bariatric Programs',
  url: '/services/weight-loss',
  excerpt:
  'Medical and surgical weight loss options including bariatric surgery, nutrition counseling, and behavior support to help you reach your health goals.',
  tags: [
  'weight loss',
  'bariatric',
  'surgery',
  'nutrition',
  'obesity',
  'wellness'],

  thumbnail:
  'https://images.unsplash.com/photo-1601651247226-0fbf76e3ee64?auto=format&fit=crop&q=80&w=400&h=400',
  category: 'Specialty Care',
  byline: 'In Weight Management',
  readTime: '4 min read',
  updatedAt: 'Updated 3d ago'
}];


export const doctors: Doctor[] = [
{
  id: 'd1',
  name: 'Dr. Sarah Chen',
  specialty: 'Cardiology',
  photoUrl:
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150',
  tags: [
  'cardiology',
  'heart',
  'vascular',
  'doctor',
  'physician',
  'chest pain']

},
{
  id: 'd2',
  name: 'Dr. Marcus Johnson',
  specialty: 'Orthopedics',
  photoUrl:
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150',
  tags: [
  'orthopedics',
  'sports medicine',
  'bone',
  'joint',
  'doctor',
  'physician']

},
{
  id: 'd3',
  name: 'Dr. Priya Patel',
  specialty: 'Primary Care',
  photoUrl:
  'https://images.unsplash.com/photo-1594824436998-d40bb60241a7?auto=format&fit=crop&q=80&w=150&h=150',
  tags: [
  'primary care',
  'family medicine',
  'pcp',
  'doctor',
  'physician',
  'checkup']

},
{
  id: 'd4',
  name: 'Dr. James Liu',
  specialty: 'Radiology',
  photoUrl:
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150&h=150',
  tags: ['radiology', 'mri', 'imaging', 'scan', 'doctor', 'physician']
},
{
  id: 'd5',
  name: 'Dr. Elena Rodriguez',
  specialty: 'Maternity',
  photoUrl:
  'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=150&h=150',
  tags: [
  'maternity',
  'obgyn',
  'pregnancy',
  'delivery',
  'doctor',
  'physician']

},
{
  id: 'd6',
  name: 'Dr. David Kim',
  specialty: 'Emergency Medicine',
  photoUrl:
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150',
  tags: [
  'emergency',
  'er',
  'urgent care',
  'doctor',
  'physician',
  'chest pain']

}];


export const locations: Location[] = [
{
  id: 'l1',
  name: 'Downtown Medical Plaza',
  address: '100 Main St, Suite 200',
  hours: 'Mon-Fri 8am-5pm',
  distance: '1.2 mi',
  tags: ['primary care', 'specialty', 'downtown', 'clinic']
},
{
  id: 'l2',
  name: 'Westside Imaging Center',
  address: '450 West Ave',
  hours: 'Mon-Sat 7am-7pm',
  distance: '3.5 mi',
  tags: ['imaging', 'mri', 'radiology', 'scan', 'westside']
},
{
  id: 'l3',
  name: 'Northpoint Urgent Care',
  address: '880 North Blvd',
  hours: 'Open 7 Days, 8am-8pm',
  distance: '4.1 mi',
  tags: ['urgent care', 'walk in', 'immediate', 'northpoint']
},
{
  id: 'l4',
  name: 'Riverside Hospital',
  address: '2000 River Rd',
  hours: 'Open 24/7',
  distance: '5.8 mi',
  tags: [
  'hospital',
  'emergency',
  'er',
  'surgery',
  'maternity',
  'cardiology',
  'heart']

},
{
  id: 'l5',
  name: 'Eastgate Family Medicine',
  address: '300 Eastgate Dr',
  hours: 'Mon-Fri 8am-6pm',
  distance: '6.2 mi',
  tags: ['primary care', 'family medicine', 'pcp', 'eastgate']
}];


export const cannedAnswers: CannedAnswer[] = [
{
  queryMatch: ['mri', 'imaging', 'scan'],
  answer:
  "General Health offers MRI imaging at 14 locations across the region, including wide-bore and open MRI options for your comfort. You will need a physician's order to schedule an MRI scan.",
  citations: ['p1', 'p2'],
  cta: {
    label: 'Find an MRI Location',
    url: '/locations/mri'
  }
},
{
  queryMatch: ['schedule', 'appointment', 'book'],
  answer:
  'You can schedule most appointments online through your MyChart portal or by using our open scheduling tool. For new patient specialist visits, you may need to call the office directly.',
  citations: ['p2', 'p7'],
  cta: {
    label: 'Schedule Now',
    url: '/patients/schedule'
  }
},
{
  queryMatch: ['physical therapy', 'pt', 'rehab'],
  answer:
  'We provide outpatient physical therapy at over 20 specialized clinics. Our licensed therapists treat sports injuries, post-surgical recovery, and chronic pain conditions with personalized care plans.',
  citations: ['p3', 'p11'],
  cta: {
    label: 'Explore PT Services',
    url: '/services/physical-therapy'
  }
},
{
  queryMatch: ['bill', 'pay', 'insurance'],
  answer:
  'You can securely pay your hospital or physician bill online through the MyChart portal or our guest pay system. We accept most major insurance plans, and offer financial assistance for those who qualify.',
  citations: ['p6', 'p7'],
  cta: {
    label: 'Pay Your Bill',
    url: '/patients/billing'
  }
},
{
  queryMatch: ['emergency', 'er', 'urgent'],
  answer:
  'For life-threatening conditions, call 911 or visit the nearest Emergency Room immediately. For minor illnesses and injuries, our Urgent Care centers offer walk-in treatment with shorter wait times and lower costs.',
  citations: ['p10', 'p4'],
  cta: {
    label: 'View ER Wait Times',
    url: '/locations/emergency'
  }
},
{
  queryMatch: ['chest pain'],
  answer:
  'Chest pain can have many causes — some serious. If your chest pain is severe, sudden, or comes with shortness of breath, sweating, nausea, or pain spreading to your arm or jaw, call 911 immediately. For mild or recurring chest discomfort, schedule a visit with a cardiologist or visit our Urgent Care for evaluation.',
  citations: ['p9', 'p10', 'p4'],
  cta: {
    label: 'See a Cardiologist',
    url: '/services/heart'
  }
},
{
  queryMatch: ['heart', 'cardiology'],
  answer:
  'General Health provides nationally recognized heart and vascular care. Our cardiologists offer advanced treatments for heart disease, arrhythmias, and structural heart conditions at multiple locations including Riverside Hospital.',
  citations: ['p9'],
  cta: {
    label: 'Explore Heart Care',
    url: '/services/heart'
  }
}];


export const conditions: Condition[] = [
{
  id: 'c1',
  name: 'Heart Attack',
  description: 'Sudden blockage of blood flow to the heart muscle. Call 911.',
  tags: ['chest pain', 'heart', 'cardiology', 'emergency', 'heart attack']
},
{
  id: 'c2',
  name: 'Angina',
  description: 'Chest discomfort caused by reduced blood flow to the heart.',
  tags: ['chest pain', 'heart', 'cardiology', 'angina']
},
{
  id: 'c3',
  name: 'Acid Reflux (GERD)',
  description: 'Burning chest pain caused by stomach acid in the esophagus.',
  tags: ['chest pain', 'reflux', 'gerd', 'heartburn', 'digestive']
},
{
  id: 'c4',
  name: 'Anxiety / Panic Attack',
  description:
  'Chest tightness, racing heart, and shortness of breath from panic.',
  tags: ['chest pain', 'anxiety', 'panic', 'mental health']
},
{
  id: 'c5',
  name: 'Costochondritis',
  description:
  'Inflammation of cartilage that connects ribs to the breastbone.',
  tags: ['chest pain', 'rib', 'inflammation', 'musculoskeletal']
},
{
  id: 'c6',
  name: 'Pulmonary Embolism',
  description:
  'A blood clot in the lungs. A medical emergency — seek care now.',
  tags: ['chest pain', 'lung', 'clot', 'emergency', 'breathing']
},
{
  id: 'c7',
  name: 'Hypertension',
  description: 'High blood pressure that can lead to heart and stroke risk.',
  tags: ['heart', 'blood pressure', 'cardiology']
},
{
  id: 'c8',
  name: 'Asthma',
  description:
  'A condition that narrows airways and makes breathing difficult.',
  tags: ['asthma', 'breathing', 'lung', 'respiratory']
},
{
  id: 'c9',
  name: 'Migraine',
  description:
  'Severe recurring headaches, often with nausea and light sensitivity.',
  tags: ['headache', 'migraine', 'neurology']
},
{
  id: 'c10',
  name: 'Diabetes',
  description:
  'A chronic condition affecting how your body processes blood sugar.',
  tags: ['diabetes', 'blood sugar', 'endocrinology']
}];


export const popularQueries = [
'Schedule an appointment',
'Pay my bill',
'Find a doctor',
'Urgent care wait times',
'MyChart login',
'MRI locations'];


export const typoMap: Record<string, string> = {
  'mri scan': 'mri',
  'physcal therapy': 'physical therapy',
  appointmnt: 'appointment',
  'urgnt care': 'urgent care',
  'my chart': 'mychart',
  doc: 'doctor',
  pediatrics: 'primary care'
};