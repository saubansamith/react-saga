// Feature 1: Pagination – Prefetch one-at-a-time
export const FETCH_PATIENTS = "FETCH_PATIENTS";       // kept for stats bar compatibility
export const SET_PATIENTS = "SET_PATIENTS";

export const FETCH_SINGLE_PATIENT = "FETCH_SINGLE_PATIENT";     // fetch one patient by index
export const SET_SINGLE_PATIENT = "SET_SINGLE_PATIENT";         // store one patient into map
export const PREFETCH_NEXT_PATIENT = "PREFETCH_NEXT_PATIENT";   // bg prefetch of next patient

// Feature 1b: Page-based pagination (3 at a time)
export const FETCH_PATIENTS_PAGE = "FETCH_PATIENTS_PAGE";       // fetch a page of 3 patients
export const SET_PATIENTS_PAGE = "SET_PATIENTS_PAGE";           // store page data as current
export const PREFETCH_PATIENTS_PAGE = "PREFETCH_PATIENTS_PAGE"; // silently prefetch next page
export const SET_PREFETCHED_PAGE = "SET_PREFETCHED_PAGE";       // store prefetched page data
export const SHOW_PREFETCHED_PAGE = "SHOW_PREFETCHED_PAGE";     // move prefetched → current

// Feature 2: Offline Queue
export const SUBMIT_PATIENT_FORM = "SUBMIT_PATIENT_FORM";
export const QUEUE_PATIENT_FORM = "QUEUE_PATIENT_FORM";
export const SYNC_OFFLINE_QUEUE = "SYNC_OFFLINE_QUEUE";
export const CLEAR_OFFLINE_QUEUE = "CLEAR_OFFLINE_QUEUE";

// Feature 3: Request Cancellation
export const FETCH_PATIENT_DETAILS = "FETCH_PATIENT_DETAILS";
export const SET_PATIENT_DETAILS = "SET_PATIENT_DETAILS";
export const CANCEL_FETCH_PATIENT_DETAILS = "CANCEL_FETCH_PATIENT_DETAILS";

// Shared flags
export const SET_LOADING = "SET_LOADING";
export const SET_NETWORK_STATUS = "SET_NETWORK_STATUS";

// Existing mock features
export const FETCH_APPOINTMENTS = "FETCH_APPOINTMENTS";
export const SET_APPOINTMENTS = "SET_APPOINTMENTS";
export const FETCH_MEDICAL_RECORDS = "FETCH_MEDICAL_RECORDS";
export const SET_MEDICAL_RECORDS = "SET_MEDICAL_RECORDS";