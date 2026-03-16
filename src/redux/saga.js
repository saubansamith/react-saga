import { call, put, takeLatest, select, takeEvery, delay } from "redux-saga/effects";
import {
  fetchPatientsAPI,
  fetchSinglePatientAPI,
  fetchPatientsByPageAPI,
  submitPatientAPI,
  fetchPatientDetailsAPI,
  fetchAppointmentsAPI,
  fetchRecordsAPI,
} from "./dummyApi";
import {
  FETCH_PATIENTS,
  SET_PATIENTS,
  FETCH_SINGLE_PATIENT,
  SET_SINGLE_PATIENT,
  PREFETCH_NEXT_PATIENT,
  FETCH_PATIENTS_PAGE,
  SET_PATIENTS_PAGE,
  PREFETCH_PATIENTS_PAGE,
  SET_PREFETCHED_PAGE,
  SUBMIT_PATIENT_FORM,
  QUEUE_PATIENT_FORM,
  SYNC_OFFLINE_QUEUE,
  CLEAR_OFFLINE_QUEUE,
  FETCH_PATIENT_DETAILS,
  SET_PATIENT_DETAILS,
  SET_LOADING,
  FETCH_APPOINTMENTS,
  SET_APPOINTMENTS,
  FETCH_MEDICAL_RECORDS,
  SET_MEDICAL_RECORDS
} from "./actions";

/* ── Worker Sagas ──────────────────────────────────────────────── */

// Fetch all patients (for stats bar – total count)
function* fetchPatientsSaga() {
  try {
    yield put({ type: SET_LOADING, payload: true });
    const response = yield call(fetchPatientsAPI);
    yield put({ type: SET_PATIENTS, payload: response.data });
  } catch (error) {
    console.error("FAILED to fetch patients list", error);
    yield put({ type: SET_LOADING, payload: false });
  }
}

// Feature 1: Fetch a SINGLE patient by ID and store it individually
function* fetchSinglePatientSaga(action) {
  const patientId = action.payload;

  // Check if already in store (skip API call – this IS the prefetch benefit)
  const existingMap = yield select((state) => state.patientMap);
  if (existingMap[patientId]) {
    console.log(`Patient ${patientId} already in store (prefetched!) – no API call`);
    return;
  }

  try {
    yield put({ type: SET_LOADING, payload: true });
    console.log(`Fetching patient ${patientId} from API...`);
    const response = yield call(fetchSinglePatientAPI, patientId);
    yield put({ type: SET_SINGLE_PATIENT, payload: response.data });
  } catch (error) {
    console.error(`Failed to fetch patient ${patientId}`, error);
    yield put({ type: SET_LOADING, payload: false });
  }
}

// Prefetch the NEXT patient in the background (silent, no loading indicator)
function* prefetchNextPatientSaga(action) {
  const nextId = action.payload;

  const existingMap = yield select((state) => state.patientMap);
  if (existingMap[nextId]) {
    console.log(`Patient ${nextId} already prefetched – skipping`);
    return;
  }

  try {
    console.log(`Prefetching patient ${nextId} in background...`);
    const response = yield call(fetchSinglePatientAPI, nextId);
    yield put({ type: SET_SINGLE_PATIENT, payload: response.data });
    console.log(`Patient ${nextId} prefetched and stored in Redux!`);
  } catch (error) {
    console.error(`Prefetch failed for patient ${nextId}`, error);
  }
}

/* ── Feature 1b: Page-based pagination (3 at a time) ───────────── */

// Fetch a PAGE of 3 patients and set as current
function* fetchPatientsPageSaga(action) {
  const page = action.payload;

  try {
    yield put({ type: SET_LOADING, payload: true });
    console.log(`Fetching page ${page} (3 patients) from dummy API...`);
    const response = yield call(fetchPatientsByPageAPI, page, 3);
    yield put({
      type: SET_PATIENTS_PAGE,
      payload: {
        patients: response.data,
        page: response.meta.page,
        totalPages: response.meta.totalPages,
      },
    });
  } catch (error) {
    console.error(`Failed to fetch page ${page}`, error);
    yield put({ type: SET_LOADING, payload: false });
  }
}

// Prefetch the NEXT page silently (no loading indicator)
function* prefetchPatientsPageSaga(action) {
  const page = action.payload;

  try {
    console.log(`⏳ Prefetching page ${page} in background...`);
    const response = yield call(fetchPatientsByPageAPI, page, 3);
    yield put({
      type: SET_PREFETCHED_PAGE,
      payload: {
        patients: response.data,
        page: response.meta.page,
        totalPages: response.meta.totalPages,
      },
    });
    console.log(`✅ Page ${page} prefetched and stored in Redux (hidden from UI)`);
  } catch (error) {
    console.error(`Prefetch failed for page ${page}`, error);
  }
}

// Feature 2: Offline Form Submission Queue
function* submitPatientSaga(action) {
  const isOnline = yield select((state) => state.isOnline);

  console.groupCollapsed("📝 [Saga] Form Submission");
  console.log("Payload:", action.payload);
  console.log("Network Status:", isOnline ? "Online" : "Offline");

  if (isOnline) {
    try {
      yield put({ type: SET_LOADING, payload: true });
      yield call(submitPatientAPI, action.payload);
      console.log("✅ Form submitted successfully online.");
      yield put({ type: SET_LOADING, payload: false });
    } catch (error) {
      console.warn("⚠️ Submission failed online, queuing data...");
      yield put({ type: QUEUE_PATIENT_FORM, payload: action.payload });
      yield put({ type: SET_LOADING, payload: false });
    }
  } else {
    console.log("🌐 Offline: Queuing form data...");
    yield put({ type: QUEUE_PATIENT_FORM, payload: action.payload });
  }

  console.groupEnd();
}

function* syncOfflineQueueSaga() {
  const isOnline = yield select((state) => state.isOnline);
  if (!isOnline) return;

  const queue = yield select((state) => state.offlineQueue);
  if (queue.length === 0) return;

  console.groupCollapsed("🔄 [Saga] Syncing Offline Queue");
  console.log(`Syncing ${queue.length} items from offline queue...`);
  yield put({ type: SET_LOADING, payload: true });

  try {
    for (let i = 0; i < queue.length; i++) {
      yield call(submitPatientAPI, queue[i]);
    }
    console.log("✅ Queue synced successfully!");
    yield put({ type: CLEAR_OFFLINE_QUEUE });
  } catch (error) {
    console.error("❌ Failed to sync queue.", error);
  } finally {
    yield put({ type: SET_LOADING, payload: false });
    console.groupEnd();
  }
}

// Feature 3: API Request Cancellation
function* fetchPatientDetailsSaga(action) {
  try {
    yield put({ type: SET_LOADING, payload: true });
    yield delay(1500); // Simulate network delay to make cancellation observable
    const response = yield call(fetchPatientDetailsAPI, action.payload);
    yield put({ type: SET_PATIENT_DETAILS, payload: response.data });
  } catch (error) {
    console.error("Failed to fetch patient details", error);
    yield put({ type: SET_LOADING, payload: false });
  }
}

// Mock Features
function* fetchAppointmentsSaga() {
  const response = yield call(fetchAppointmentsAPI);
  yield put({ type: SET_APPOINTMENTS, payload: response.data });
}

function* fetchMedicalRecordsSaga() {
  const response = yield call(fetchRecordsAPI);
  yield put({ type: SET_MEDICAL_RECORDS, payload: response.data });
}

/* ── Watcher Saga ──────────────────────────────────────────────── */
export default function* rootSaga() {
  // Feature 1 – Prefetch pagination (single)
  yield takeLatest(FETCH_PATIENTS, fetchPatientsSaga);
  yield takeEvery(FETCH_SINGLE_PATIENT, fetchSinglePatientSaga);
  yield takeEvery(PREFETCH_NEXT_PATIENT, prefetchNextPatientSaga);

  // Feature 1b – Page-based prefetch pagination (3 at a time)
  yield takeLatest(FETCH_PATIENTS_PAGE, fetchPatientsPageSaga);
  yield takeLatest(PREFETCH_PATIENTS_PAGE, prefetchPatientsPageSaga);

  // Feature 2 – Offline queue
  yield takeEvery(SUBMIT_PATIENT_FORM, submitPatientSaga);
  yield takeLatest(SYNC_OFFLINE_QUEUE, syncOfflineQueueSaga);

  // Feature 3 – takeLatest cancels any running fetchPatientDetailsSaga
  yield takeLatest(FETCH_PATIENT_DETAILS, fetchPatientDetailsSaga);

  yield takeLatest(FETCH_APPOINTMENTS, fetchAppointmentsSaga);
  yield takeLatest(FETCH_MEDICAL_RECORDS, fetchMedicalRecordsSaga);
}