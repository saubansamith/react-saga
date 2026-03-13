import {
  SET_PATIENTS,
  SET_SINGLE_PATIENT,
  SET_APPOINTMENTS,
  SET_MEDICAL_RECORDS,
  QUEUE_PATIENT_FORM,
  CLEAR_OFFLINE_QUEUE,
  SET_PATIENT_DETAILS,
  SET_LOADING,
  SET_NETWORK_STATUS
} from "./actions";

const initialState = {
  // Feature 1: Prefetch pagination
  patients: [],                 // full list (kept for stats bar)
  patientMap: {},               // { [id]: patientData } – individual fetched patients
  prefetchedIds: [],            // ordered list of fetched patient IDs

  // Feature 2: Offline Queue
  offlineQueue: [],

  // Feature 3: Cancellation
  patientDetails: null,

  // Shared
  loading: false,
  isOnline: navigator.onLine,

  // Extras
  appointments: [],
  medicalRecords: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case SET_PATIENTS:
      return { ...state, patients: action.payload, loading: false };

    // Store one patient into the map (used for prefetch)
    case SET_SINGLE_PATIENT: {
      const patient = action.payload;
      const alreadyExists = state.prefetchedIds.includes(patient.id);
      return {
        ...state,
        patientMap: { ...state.patientMap, [patient.id]: patient },
        prefetchedIds: alreadyExists
          ? state.prefetchedIds
          : [...state.prefetchedIds, patient.id],
        loading: false
      };
    }

    case QUEUE_PATIENT_FORM:
      return { ...state, offlineQueue: [...state.offlineQueue, action.payload] };

    case CLEAR_OFFLINE_QUEUE:
      return { ...state, offlineQueue: [] };

    case SET_PATIENT_DETAILS:
      return { ...state, patientDetails: action.payload, loading: false };

    case SET_LOADING:
      return { ...state, loading: action.payload };

    case SET_NETWORK_STATUS:
      return { ...state, isOnline: action.payload };

    case SET_APPOINTMENTS:
      return { ...state, appointments: action.payload };

    case SET_MEDICAL_RECORDS:
      return { ...state, medicalRecords: action.payload };

    default:
      return state;
  }
}
