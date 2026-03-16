import {
  SET_PATIENTS,
  SET_SINGLE_PATIENT,
  SET_PATIENTS_PAGE,
  SET_PREFETCHED_PAGE,
  SHOW_PREFETCHED_PAGE,
  SET_APPOINTMENTS,
  SET_MEDICAL_RECORDS,
  QUEUE_PATIENT_FORM,
  CLEAR_OFFLINE_QUEUE,
  SET_PATIENT_DETAILS,
  SET_LOADING,
  SET_NETWORK_STATUS
} from "./actions";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/cryptoStorage";

const persistedPatients = loadFromLocalStorage("medflow_patients") || [];
const persistedQueue = loadFromLocalStorage("medflow_offlineQueue") || [];

const initialState = {
  patients: persistedPatients,

  appointments: [],
  medicalRecords: [],

  // Feature 1: Prefetch pagination (single)
  patientMap: {},               // { [id]: patientData } – individually fetched patients
  prefetchedIds: [],            // ordered list of fetched patient IDs

  // Feature 1b: Page-based pagination (3 at a time)
  currentPageData: [],          // the 3 patients currently visible
  prefetchedPageData: [],       // the next 3 patients (hidden until "Next" click)
  currentPage: 0,               // current page number (1-indexed, 0 = not loaded)
  prefetchedPage: 0,            // which page is prefetched (0 = none)
  totalPages: 1,                // total number of pages

  // Feature 2: Offline Queue
  offlineQueue: persistedQueue,


  // Feature 3: Cancellation
  patientDetails: null,

  // Shared
  loading: false,
  isOnline: navigator.onLine
};

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case SET_PATIENTS: // update the patient state and redux store update
      saveToLocalStorage("medflow_patients", action.payload);
      console.log("[Reducer] Saved patients array to AES localStorage");
      return {
        ...state,
        patients: action.payload
      };

    case SET_APPOINTMENTS:
      return {
        ...state,
        appointments: action.payload
      };

    case SET_MEDICAL_RECORDS:
      return {
        ...state,
        medicalRecords: action.payload
      };

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

    // ── Page-based pagination ──────────────────────────────────

    // Set fetched page as the current visible page
    case SET_PATIENTS_PAGE:
      return {
        ...state,
        currentPageData: action.payload.patients,
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        loading: false,
      };

    // Store prefetched page (hidden from UI)
    case SET_PREFETCHED_PAGE:
      return {
        ...state,
        prefetchedPageData: action.payload.patients,
        prefetchedPage: action.payload.page,
        totalPages: action.payload.totalPages,
      };

    // Move prefetched → current (on "Next" click)
    case SHOW_PREFETCHED_PAGE:
      return {
        ...state,
        currentPageData: state.prefetchedPageData,
        currentPage: state.prefetchedPage,
        prefetchedPageData: [],
        prefetchedPage: 0,
        loading: false,
      };

    case QUEUE_PATIENT_FORM: {
      const newQueue = [...state.offlineQueue, action.payload];
      saveToLocalStorage("medflow_offlineQueue", newQueue);
      console.log("[Reducer] Queued patient and saved to AES localStorage");
      return {
        ...state,
        offlineQueue: newQueue
      };
    }

    case CLEAR_OFFLINE_QUEUE:
      saveToLocalStorage("medflow_offlineQueue", []);
      console.log("[Reducer] Cleared offline queue from AES localStorage");
      return {
        ...state,
        offlineQueue: []
      };

    case SET_PATIENT_DETAILS:
      return {
        ...state,
        patientDetails: action.payload,
        loading: false
      };

    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case SET_NETWORK_STATUS:
      return {
        ...state,
        isOnline: action.payload
      };

    default:
      return state;
  }
}