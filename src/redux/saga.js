import { call, put, takeEvery } from "redux-saga/effects";
import {
  FETCH_PATIENTS,
  SET_PATIENTS,
  FETCH_APPOINTMENTS,
  SET_APPOINTMENTS,
  FETCH_MEDICAL_RECORDS,
  SET_MEDICAL_RECORDS
} from "./actions";

/* API Calls */

const fetchPatientsAPI = () => // api req
  fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => res.json());

const fetchAppointmentsAPI = () =>
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json());

const fetchRecordsAPI = () =>
  fetch("https://jsonplaceholder.typicode.com/comments")
    .then(res => res.json());

/* Worker Sagas */

function* fetchPatientsSaga() {
  const data = yield call(fetchPatientsAPI); // it call the api in async fn
  yield put({ type: SET_PATIENTS, payload: data }); // dispatch a new action
}

function* fetchAppointmentsSaga() {
  const data = yield call(fetchAppointmentsAPI);
  yield put({ type: SET_APPOINTMENTS, payload: data });
}

function* fetchMedicalRecordsSaga() {
  const data = yield call(fetchRecordsAPI);
  yield put({ type: SET_MEDICAL_RECORDS, payload: data });
}

/* Watcher Saga */

export default function* rootSaga() {
  yield takeEvery(FETCH_PATIENTS, fetchPatientsSaga); // it listens the action and calls worker saga
  yield takeEvery(FETCH_APPOINTMENTS, fetchAppointmentsSaga);
  yield takeEvery(FETCH_MEDICAL_RECORDS, fetchMedicalRecordsSaga);
}