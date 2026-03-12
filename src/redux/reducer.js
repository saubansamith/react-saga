import {
  SET_PATIENTS,
  SET_APPOINTMENTS,
  SET_MEDICAL_RECORDS
} from "./actions";

const initialState = {
  patients: [],
  appointments: [],
  medicalRecords: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case SET_PATIENTS: // update the patient state and redux store update
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

    default:
      return state;
  }
}