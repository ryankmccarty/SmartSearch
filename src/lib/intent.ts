import { QueryIntent } from '../data/healthcareData';

export function detectIntent(query: string): QueryIntent {
  const q = query.toLowerCase();

  if (q.match(/\b(pain|ache|hurt|sore|swollen|bleed|dizzy|nausea|fever|symptom|what.?caus|could.?be|shortness|headache|tired|fatigue|rash|lump|discharge|vomit|diarrhea|constipat)\b/))
    return 'condition';

  if (q.match(/\b(mri|ct scan|x-?ray|ultrasound|colonoscopy|endoscopy|biopsy|procedure|prepare|preparation|before my|checklist|what to expect|pre-?op)\b/))
    return 'procedure';

  if (q.match(/\b(insurance|coverage|covered|billing|cost|how much|pay|payment|deductible|copay|copayment|financial|afford|bill|estimate|medicaid|medicare)\b/))
    return 'insurance';

  if (q.match(/\b(doctor|physician|specialist|cardiologist|dermatologist|oncologist|neurologist|ob-gyn|obgyn|pediatrician|find a|primary care|who treats|book an appointment|new patient)\b/))
    return 'find-doctor';

  if (q.match(/\b(location|locations|near me|hours|open|clinic|hospital|urgent care|\ber\b|emergency room|where|directions|close to|weekend|today|distance)\b/))
    return 'find-location';

  return 'general';
}

export function detectConditionKey(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('chest pain') || q.includes('chest hurt') || q.includes('chest tight')) return 'chest pain';
  if (q.includes('back pain') || q.includes('lower back') || q.includes('backache')) return 'lower back pain';
  return 'generic';
}

export function detectProcedureKey(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('mri')) return 'mri';
  return 'generic';
}
