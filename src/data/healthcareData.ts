export type QueryIntent = 'find-doctor' | 'find-location' | 'condition' | 'procedure' | 'insurance' | 'general';

export interface Citation {
  id: number;
  source: string;
  title: string;
  url: string;
}

export interface ConditionSection {
  title: string;
  content?: string;
  items?: { text: string; citation?: number }[];
  urgent?: boolean;
}

export interface ConditionData {
  name: string;
  emergency: boolean;
  summary: string;
  sections: ConditionSection[];
  citations: Citation[];
  relatedSpecialties: string[];
  followUps: string[];
}

export interface PrepStep {
  text: string;
  important?: boolean;
}

export interface PrepPhase {
  label: string;
  steps: PrepStep[];
}

export interface ProcedureData {
  name: string;
  summary: string;
  timeline: PrepPhase[];
  citations: Citation[];
  followUps: string[];
}

export interface InsuranceFAQ {
  question: string;
  answer: string;
}

export interface InsuranceData {
  summary: string;
  faqs: InsuranceFAQ[];
  followUps: string[];
}

// ─── Conditions ───────────────────────────────────────────────────────────────

export const conditionData: Record<string, ConditionData> = {
  'lower back pain': {
    name: 'Lower Back Pain',
    emergency: false,
    summary: 'Lower back pain is one of the most common reasons people see a doctor, affecting about 80% of adults at some point. Most episodes improve within a few weeks with rest, gentle movement, and over-the-counter pain relief. Persistent or severe pain — especially with leg numbness or bladder changes — warrants a medical evaluation.',
    sections: [
      {
        title: 'Overview',
        content: 'Lower back pain affects the lumbar region of the spine and ranges from a dull ache to a sharp, shooting sensation. It may be acute (lasting under 6 weeks), subacute (6–12 weeks), or chronic (over 12 weeks). The lower back bears most of the body\'s weight, making it susceptible to strain and injury.',
      },
      {
        title: 'Common Causes',
        items: [
          { text: 'Muscle or ligament strain from heavy lifting or sudden movement', citation: 1 },
          { text: 'Bulging or ruptured disc pressing on nearby nerves', citation: 1 },
          { text: 'Arthritis, including osteoarthritis and spinal stenosis', citation: 2 },
          { text: 'Skeletal irregularities such as scoliosis', citation: 2 },
          { text: 'Osteoporosis leading to vertebral compression fractures', citation: 3 },
          { text: 'Kidney stones or infections (referred pain)', citation: 3 },
        ],
      },
      {
        title: 'When to See a Doctor',
        urgent: true,
        items: [
          { text: 'Pain that is severe, worsening, or has lasted more than 2 weeks' },
          { text: 'Pain after a fall, impact, or other injury' },
          { text: 'Numbness, tingling, or weakness in one or both legs' },
          { text: 'Bladder or bowel control problems' },
          { text: 'Pain accompanied by unexplained weight loss or fever' },
        ],
      },
      {
        title: 'Treatments',
        items: [
          { text: 'OTC pain relievers — ibuprofen or acetaminophen for short-term relief', citation: 1 },
          { text: 'Heat and ice therapy in the first 48–72 hours', citation: 2 },
          { text: 'Physical therapy to strengthen core and back muscles', citation: 1 },
          { text: 'Prescription muscle relaxants for acute spasms (short-term)', citation: 3 },
          { text: 'Epidural corticosteroid injections for nerve-related pain', citation: 2 },
          { text: 'Surgery is rarely needed and typically a last resort', citation: 3 },
        ],
      },
      {
        title: 'Related Specialties',
        items: [
          { text: 'Orthopedics' },
          { text: 'Physical Medicine & Rehabilitation' },
          { text: 'Neurology' },
          { text: 'Pain Management' },
          { text: 'Primary Care' },
        ],
      },
    ],
    citations: [
      { id: 1, source: 'Mayo Clinic', title: 'Back pain — Symptoms and causes', url: '#' },
      { id: 2, source: 'NIH (NIAMS)', title: 'Back Pain Fact Sheet', url: '#' },
      { id: 3, source: 'Cleveland Clinic', title: 'Low Back Pain: Diagnosis & Treatment', url: '#' },
    ],
    relatedSpecialties: ['Orthopedics', 'Physical Medicine', 'Neurology', 'Pain Management'],
    followUps: [
      'Find an orthopedic specialist near me',
      'What tests diagnose lower back pain?',
      'Physical therapy locations accepting patients',
      'What exercises help with lower back pain?',
      'Is my back pain a spine problem?',
    ],
  },

  'chest pain': {
    name: 'Chest Pain',
    emergency: true,
    summary: 'Chest pain can range from a minor issue — like heartburn or a pulled muscle — to a life-threatening emergency such as a heart attack. If your pain is sudden, severe, or comes with shortness of breath, sweating, nausea, or arm/jaw pain, call 911 immediately. Do not drive yourself to the hospital.',
    sections: [
      {
        title: 'Overview',
        content: 'Chest pain is any discomfort in the chest area, including tightness, pressure, squeezing, burning, or aching. While the heart is often the first concern, chest pain can also arise from the lungs, esophagus, muscles, ribs, and nerves. A clinical evaluation is needed to determine the cause.',
      },
      {
        title: 'Common Causes',
        items: [
          { text: 'Heart attack — blockage of blood flow to the heart muscle', citation: 1 },
          { text: 'Angina — reduced blood flow, often triggered by exertion', citation: 1 },
          { text: 'Pulmonary embolism — a blood clot in the lungs', citation: 1 },
          { text: 'Acid reflux or GERD — stomach acid backing into the esophagus', citation: 2 },
          { text: 'Pericarditis — inflammation of the sac surrounding the heart', citation: 2 },
          { text: 'Costochondritis — inflammation of the cartilage connecting ribs to the sternum', citation: 3 },
          { text: 'Anxiety or panic attacks — physical symptoms can mimic cardiac events', citation: 3 },
        ],
      },
      {
        title: 'When to See a Doctor',
        urgent: true,
        items: [
          { text: 'Call 911 immediately for sudden, severe, or crushing chest pain' },
          { text: 'Pain that spreads to your arm, jaw, neck, or back' },
          { text: 'Shortness of breath, cold sweats, or nausea alongside chest pain' },
          { text: 'Pain that lasts more than a few minutes, fades, then returns' },
          { text: 'Any new chest pain in someone with a history of heart disease' },
        ],
      },
      {
        title: 'Treatments',
        items: [
          { text: 'Emergency cardiac care — stents, clot-dissolving drugs, or bypass surgery', citation: 1 },
          { text: 'Medications: nitroglycerin, aspirin, beta-blockers for cardiac causes', citation: 1 },
          { text: 'Antacids or proton pump inhibitors for acid reflux-related pain', citation: 2 },
          { text: 'Anti-inflammatories for pericarditis or costochondritis', citation: 3 },
          { text: 'Lifestyle changes: diet, exercise, smoking cessation, stress management', citation: 2 },
        ],
      },
      {
        title: 'Related Specialties',
        items: [
          { text: 'Cardiology' },
          { text: 'Emergency Medicine' },
          { text: 'Gastroenterology' },
          { text: 'Pulmonology' },
          { text: 'Primary Care' },
        ],
      },
    ],
    citations: [
      { id: 1, source: 'American Heart Association', title: 'Warning Signs of a Heart Attack', url: '#' },
      { id: 2, source: 'Mayo Clinic', title: 'Chest pain — Symptoms and causes', url: '#' },
      { id: 3, source: 'Cleveland Clinic', title: 'Chest Pain: Causes, Diagnosis & Treatment', url: '#' },
    ],
    relatedSpecialties: ['Cardiology', 'Emergency Medicine', 'Gastroenterology', 'Pulmonology'],
    followUps: [
      'Find a cardiologist near me',
      'Nearest ER with cardiology services',
      'What tests check heart health?',
      'Difference between heartburn and heart attack',
      'Heart attack risk factors',
    ],
  },
};

export const genericCondition: ConditionData = {
  name: 'Symptoms',
  emergency: false,
  summary: 'Based on what you described, there are several possible explanations. The information here is for general education only — it is not a diagnosis. Please speak with a healthcare provider for a proper evaluation of your specific situation.',
  sections: [
    {
      title: 'When to Seek Care Right Away',
      urgent: true,
      items: [
        { text: 'Symptoms are severe, sudden, or rapidly getting worse' },
        { text: 'High fever over 103°F / 39.4°C that doesn\'t improve' },
        { text: 'Difficulty breathing, chest pain, or altered consciousness' },
        { text: 'Any symptom that deeply concerns you — trust your instincts' },
      ],
    },
    {
      title: 'Your Care Options',
      items: [
        { text: 'Primary care provider — best for ongoing and non-urgent concerns' },
        { text: 'Urgent care — same-day evaluation without an ER visit' },
        { text: 'Telehealth — often available same day from home' },
        { text: 'Emergency department — for severe or potentially life-threatening symptoms' },
      ],
    },
  ],
  citations: [
    { id: 1, source: 'NIH MedlinePlus', title: 'When to Call the Doctor', url: '#' },
  ],
  relatedSpecialties: ['Primary Care', 'Urgent Care', 'Telehealth'],
  followUps: [
    'Find a primary care doctor',
    'Urgent care near me',
    'Schedule a video visit today',
    'Nurse advice line',
  ],
};

// ─── Procedures ───────────────────────────────────────────────────────────────

export const procedureData: Record<string, ProcedureData> = {
  'mri': {
    name: 'MRI Preparation',
    summary: 'An MRI is a safe, painless scan that uses magnetic fields and radio waves to create detailed images. No radiation is involved. Most MRI scans take 15–90 minutes. Following these preparation steps helps ensure an accurate result and keeps you safe.',
    timeline: [
      {
        label: '48 hours before',
        steps: [
          { text: 'Tell your doctor about any implants — pacemaker, cochlear implant, metal fragments, or joint replacements', important: true },
          { text: 'Inform your care team if you are pregnant or think you might be', important: true },
          { text: 'Disclose all allergies, especially to contrast dye (gadolinium)' },
          { text: 'Arrange a driver if sedation or contrast will be used' },
          { text: 'Ask your doctor whether to pause any medications beforehand' },
        ],
      },
      {
        label: '24 hours before',
        steps: [
          { text: 'Follow any dietary restrictions provided by your care team' },
          { text: 'Avoid heavy exercise if instructed' },
          { text: 'Confirm the time, location, and whether to arrive early for contrast prep' },
        ],
      },
      {
        label: 'Day of the scan',
        steps: [
          { text: 'Wear comfortable, loose-fitting clothing with no metal — no zippers, underwire, or buttons', important: true },
          { text: 'Leave jewelry, watches, piercings, and hair clips at home', important: true },
          { text: 'Leave credit cards at home — the magnetic field can erase them' },
          { text: 'Eat and take medications as normal unless specifically told otherwise' },
          { text: 'Arrive 15 minutes early to complete screening paperwork' },
        ],
      },
      {
        label: 'At the imaging center',
        steps: [
          { text: 'You\'ll change into a gown and remove any remaining metal items' },
          { text: 'An IV may be placed in your arm if contrast is ordered by your doctor' },
          { text: 'You\'ll lie on a padded table that slides into the MRI machine' },
          { text: 'Earplugs or headphones are provided for the loud knocking sounds' },
          { text: 'You can speak with the technologist at any time via intercom' },
          { text: 'Results are reviewed by a radiologist and sent to your referring physician' },
        ],
      },
    ],
    citations: [
      { id: 1, source: 'RadiologyInfo.org', title: 'Magnetic Resonance Imaging (MRI) of the Body', url: '#' },
      { id: 2, source: 'Mayo Clinic', title: 'MRI — What you can expect', url: '#' },
    ],
    followUps: [
      'Find an MRI imaging location near me',
      'How long does an MRI take?',
      'What if I\'m claustrophobic?',
      'When will I receive my MRI results?',
      'What\'s the difference between MRI and CT scan?',
    ],
  },
};

export const genericProcedure: ProcedureData = {
  name: 'Procedure Preparation',
  summary: 'Proper preparation helps ensure a safe, comfortable experience and accurate results. Your care team will provide specific instructions — these are general guidelines to get you ready.',
  timeline: [
    {
      label: 'Before your procedure',
      steps: [
        { text: 'Follow all instructions from your doctor or care team', important: true },
        { text: 'Share a complete list of all medications and supplements you take' },
        { text: 'Disclose any allergies or prior reactions to anesthesia or contrast dye' },
        { text: 'Arrange transportation — you may not be able to drive afterward' },
        { text: 'Ask your care team any questions you have ahead of time' },
      ],
    },
    {
      label: 'Day of the procedure',
      steps: [
        { text: 'Arrive at least 15 minutes before your appointment' },
        { text: 'Bring your insurance card, a photo ID, and any referrals or orders' },
        { text: 'Bring your current medication list' },
        { text: 'Leave valuables at home when possible' },
      ],
    },
  ],
  citations: [
    { id: 1, source: 'NIH MedlinePlus', title: 'Preparing for Surgery', url: '#' },
  ],
  followUps: [
    'What questions should I ask my doctor?',
    'Find the right imaging location',
    'What to bring to your appointment',
  ],
};

// ─── Insurance ────────────────────────────────────────────────────────────────

export const insuranceData: InsuranceData = {
  summary: 'Coverage depends on your specific plan, the service requested, and whether the provider is in-network. We accept most major insurance. Our financial counselors can verify your benefits and provide a cost estimate before your visit — at no charge to you.',
  faqs: [
    {
      question: 'How do I verify my coverage before a visit?',
      answer: 'Call the member services number on the back of your insurance card, or log in to your insurer\'s online member portal. You can also contact our Patient Financial Services team — we can verify your benefits and answer cost questions on your behalf.',
    },
    {
      question: 'What if I have a high deductible or no insurance?',
      answer: 'We offer financial assistance programs, charity care, and flexible payment plans. Our financial counselors can also help connect you with coverage options through the Health Insurance Marketplace. No one is turned away due to inability to pay.',
    },
    {
      question: 'Do you accept Medicare and Medicaid?',
      answer: 'Yes. We accept Medicare, Medicaid, and most Medicare Advantage plans. Coverage may vary by service and location — our team can confirm the specifics for your situation.',
    },
    {
      question: 'How do I get an estimate of what I\'ll owe?',
      answer: 'Use our online cost estimator or call Patient Financial Services. For scheduled procedures, we provide a Good Faith Estimate at least 3 business days before your appointment, as required by federal law.',
    },
  ],
  followUps: [
    'Which insurance plans do you accept?',
    'Apply for financial assistance',
    'What is a Good Faith Estimate?',
    'Pay my bill online',
    'Talk to a financial counselor',
  ],
};
