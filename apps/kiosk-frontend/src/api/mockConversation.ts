export const QUESTION_TREE = [
  { id: 'q1', question: 'Where is the pain or discomfort?', options: ['Chest', 'Abdomen', 'Head', 'Joints', 'Other'], redFlagTriggers: ['chest'] },
  { id: 'q2', question: 'When did it start?', options: ['Today', 'This week', 'This month', 'More than a month ago'], redFlagTriggers: [] },
  { id: 'q3', question: 'How would you describe the sensation?', options: ['Sharp/Stabbing', 'Dull/Aching', 'Burning', 'Pressure/Tightness'], redFlagTriggers: ['pressure/tightness'] },
  { id: 'q4', question: 'Does it spread anywhere?', options: ['Left arm', 'Jaw/Neck', 'Back', 'Stays in one place'], redFlagTriggers: ['left arm', 'jaw/neck'] },
  { id: 'q5', question: 'On a scale of 1 to 10, how severe is the pain?', options: ['1-3 (Mild)', '4-6 (Moderate)', '7-8 (Severe)', '9-10 (Unbearable)'], redFlagTriggers: ['9-10'] },
];

export const RED_FLAG_RULES = [
  { triggers: ['chest', 'pressure/tightness'], flag: 'Chest tightness — Possible cardiac concern. Priority triage.' },
  { triggers: ['chest', 'left arm'], flag: 'Chest pain radiating to left arm — URGENT: Possible MI. Notify staff immediately.' },
];
