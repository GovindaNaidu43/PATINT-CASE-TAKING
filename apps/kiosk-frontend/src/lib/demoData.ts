const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getDemoAbhaId = () => `91-${randomInt(1000, 9999)}-${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`;
export const getDemoAbhiId = () => `ABHI-${Date.now().toString().slice(-8)}-${randomInt(1000, 9999)}`;

export const dummyLoginCredentials = {
  abha: '91-1234-5678-9012',
  abhi: 'ABHI-20240609-1243',
};

export const generateRandomDemoPatient = () => {
  const names = ['Ananya Sharma', 'Rohan Mehta', 'Meera Iyer', 'Vikram Nair', 'Aditi Rao', 'Sanjay Patel'];
  const occupations = ['Teacher', 'Engineer', 'Designer', 'Consultant', 'Doctor', 'Farmer'];
  const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'O-'];
  const genders = ['Female', 'Male', 'Other'];

  const index = randomInt(0, names.length - 1);

  return {
    name: names[index],
    age: 18 + randomInt(0, 55),
    gender: genders[randomInt(0, genders.length - 1)],
    contact: `90000${String(randomInt(10000, 99999))}`,
    blood_group: bloodGroups[index % bloodGroups.length],
    occupation: occupations[index % occupations.length],
    abha_id: getDemoAbhaId(),
    consent_granted: false,
  };
};

export const generateDemoConversationAnswers = () => {
  const complaints = [
    'Headache and tiredness',
    'Burning pain in the chest',
    'Lower back ache',
    'Stomach discomfort',
    'Cough and fatigue',
    'Joint stiffness',
  ];

  const severities = ['3', '5', '7', '2', '8'];
  const timings = ['For two days', 'Since last night', 'For the past week', 'For a month'];
  const contexts = [
    'No fever or vomiting',
    'Better with rest',
    'Worse after exertion',
    'No relief with home remedies',
    'Feels better after eating',
  ];

  return [
    complaints[randomInt(0, complaints.length - 1)],
    severities[randomInt(0, severities.length - 1)],
    timings[randomInt(0, timings.length - 1)],
    contexts[randomInt(0, contexts.length - 1)],
  ];
};
