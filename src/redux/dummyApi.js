/* ── Dummy API ─────────────────────────────────────────────────────
   Replaces all axios / JSONPlaceholder calls with local mock data.
   Every function returns a Promise (simulating network delay)
   that resolves to { data: ... } – same shape axios would return.
   ──────────────────────────────────────────────────────────────── */

const DUMMY_PATIENTS = [
  { id: 1, name: "Leanne Graham", email: "leanne@medflow.com", phone: "1-770-736-8031", company: { name: "Romaguera-Crona" }, address: { city: "Gwenborough", street: "Kulas Light", suite: "Apt. 556" } },
  { id: 2, name: "Ervin Howell", email: "ervin@medflow.com", phone: "010-692-6593", company: { name: "Deckow-Crist" }, address: { city: "Wisokyburgh", street: "Victor Plains", suite: "Suite 879" } },
  { id: 3, name: "Clementine Bauch", email: "clementine@medflow.com", phone: "1-463-123-4447", company: { name: "Romaguera-Jacobson" }, address: { city: "McKenziehaven", street: "Douglas Extension", suite: "Suite 847" } },
  { id: 4, name: "Patricia Lebsack", email: "patricia@medflow.com", phone: "493-170-9623", company: { name: "Robel-Corkery" }, address: { city: "South Elvis", street: "Hoeger Mall", suite: "Apt. 692" } },
  { id: 5, name: "Chelsey Dietrich", email: "chelsey@medflow.com", phone: "254-954-1289", company: { name: "Keebler LLC" }, address: { city: "Roscoeview", street: "Skiles Walks", suite: "Suite 351" } },
  { id: 6, name: "Dennis Schulist", email: "dennis@medflow.com", phone: "1-477-935-8478", company: { name: "Considine-Lockman" }, address: { city: "South Christy", street: "Norberto Crossing", suite: "Apt. 950" } },
  { id: 7, name: "Kurtis Weissnat", email: "kurtis@medflow.com", phone: "210-067-6132", company: { name: "Johns Group" }, address: { city: "Howemouth", street: "Rex Trail", suite: "Suite 280" } },
  { id: 8, name: "Nicholas Runolfsdottir", email: "nicholas@medflow.com", phone: "586-493-6943", company: { name: "Abernathy Group" }, address: { city: "Aliyaview", street: "Ellsworth Summit", suite: "Suite 729" } },
  { id: 9, name: "Glenna Reichert", email: "glenna@medflow.com", phone: "775-976-6794", company: { name: "Yost and Sons" }, address: { city: "Bartholomebury", street: "Dayna Park", suite: "Suite 449" } },
  { id: 10, name: "Clementina DuBuque", email: "clementina@medflow.com", phone: "024-648-3804", company: { name: "Hoeger LLC" }, address: { city: "Lebsackbury", street: "Kattie Turnpike", suite: "Suite 198" } },
  { id: 11, name: "Rajesh Patel", email: "rajesh@medflow.com", phone: "312-555-0147", company: { name: "MedTech Solutions" }, address: { city: "Springfield", street: "Oak Avenue", suite: "Apt. 201" } },
  { id: 12, name: "Sofia Martinez", email: "sofia@medflow.com", phone: "415-555-0198", company: { name: "HealthFirst Inc." }, address: { city: "Riverside", street: "Maple Drive", suite: "Suite 100" } },
  { id: 13, name: "Michael Chang", email: "michael@medflow.com", phone: "206-555-0134", company: { name: "BioGenetics Ltd" }, address: { city: "Seattle", street: "Pine Street", suite: "Apt. 402" } },
  { id: 14, name: "Sarah Jenkins", email: "sarah@medflow.com", phone: "617-555-0177", company: { name: "Alpha Health" }, address: { city: "Boston", street: "Beacon Street", suite: "Suite 5B" } },
  { id: 15, name: "David O'Connor", email: "david@medflow.com", phone: "305-555-0112", company: { name: "Oceanic Care" }, address: { city: "Miami", street: "Biscayne Blvd", suite: "Apt. 810" } },
  { id: 16, name: "Maria Garcia", email: "maria@medflow.com", phone: "713-555-0189", company: { name: "Texas Medical" }, address: { city: "Houston", street: "Main Street", suite: "Suite 2200" } },
  { id: 17, name: "James Wilson", email: "james@medflow.com", phone: "404-555-0145", company: { name: "Peach State Health" }, address: { city: "Atlanta", street: "Peachtree St", suite: "Apt. 12" } },
  { id: 18, name: "Emily Chen", email: "emily@medflow.com", phone: "415-555-0167", company: { name: "Bay Area Clinics" }, address: { city: "San Francisco", street: "Market Street", suite: "Suite 500" } },
  { id: 19, name: "William Taylor", email: "william@medflow.com", phone: "312-555-0199", company: { name: "Windy City Health" }, address: { city: "Chicago", street: "Michigan Ave", suite: "Apt. 305" } },
  { id: 20, name: "Olivia Thomas", email: "olivia@medflow.com", phone: "213-555-0123", company: { name: "LA Medical Group" }, address: { city: "Los Angeles", street: "Wilshire Blvd", suite: "Suite 1000" } },
];

const DELAY_MS = 400; // simulate network latency

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ── Exported API functions ──────────────────────────────────────── */

// Returns ALL patients (used by stats bar)
export const fetchPatientsAPI = async () => {
  await wait(DELAY_MS);
  return { data: DUMMY_PATIENTS };
};

// Returns a single patient by ID
export const fetchSinglePatientAPI = async (id) => {
  await wait(DELAY_MS);
  const patient = DUMMY_PATIENTS.find((p) => p.id === id);
  if (!patient) throw new Error(`Patient ${id} not found`);
  return { data: patient };
};

// Returns a page of patients (page is 1-indexed, pageSize = 3)
export const fetchPatientsByPageAPI = async (page, pageSize = 3) => {
  await wait(DELAY_MS);
  const start = (page - 1) * pageSize;
  const slice = DUMMY_PATIENTS.slice(start, start + pageSize);
  return {
    data: slice,
    meta: {
      page,
      pageSize,
      total: DUMMY_PATIENTS.length,
      totalPages: Math.ceil(DUMMY_PATIENTS.length / pageSize),
    },
  };
};

// Simulates form submission – just returns the data back
export const submitPatientAPI = async (data) => {
  await wait(DELAY_MS);
  return { data: { ...data, id: DUMMY_PATIENTS.length + 1 } };
};

// Returns a single patient (alias for details view)
export const fetchPatientDetailsAPI = async (id) => {
  await wait(DELAY_MS);
  const patient = DUMMY_PATIENTS.find((p) => p.id === id);
  if (!patient) throw new Error(`Patient ${id} not found`);
  return { data: patient };
};

// Mock appointments
export const fetchAppointmentsAPI = async () => {
  await wait(DELAY_MS);
  return {
    data: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Appointment ${i + 1}`,
      body: `Follow-up consultation for patient ${i + 1}`,
    })),
  };
};

// Mock medical records
export const fetchRecordsAPI = async () => {
  await wait(DELAY_MS);
  return {
    data: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Record ${i + 1}`,
      email: `record${i + 1}@medflow.com`,
      body: `Medical record notes for case ${i + 1}`,
    })),
  };
};

export const TOTAL_PATIENTS = DUMMY_PATIENTS.length;
export const PAGE_SIZE = 3;
export const TOTAL_PAGES = Math.ceil(DUMMY_PATIENTS.length / PAGE_SIZE);
