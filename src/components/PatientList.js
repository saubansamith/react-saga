import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FETCH_PATIENTS,
    FETCH_SINGLE_PATIENT,
    PREFETCH_NEXT_PATIENT
} from "../redux/actions";

/* Icons */
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const ChevronLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ChevronRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>);
const ZapIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);

// JSONPlaceholder has users with IDs 1-10
const TOTAL_API_PATIENTS = 10;

function PatientList({ onPatientSelect }) {
    const dispatch = useDispatch();
    const patientMap = useSelector(state => state.patientMap);
    const prefetchedIds = useSelector(state => state.prefetchedIds);
    const loading = useSelector(state => state.loading);
    const patients = useSelector(state => state.patients);

    const [currentId, setCurrentId] = useState(1);       // currently viewed patient ID
    const [animDirection, setAnimDirection] = useState(null);

    // On mount: fetch patient 1 + prefetch patient 2
    useEffect(() => {
        dispatch({ type: FETCH_SINGLE_PATIENT, payload: 1 });
        dispatch({ type: PREFETCH_NEXT_PATIENT, payload: 2 });
        // Also fetch all patients for the stats bar count
        if (patients.length === 0) {
            dispatch({ type: FETCH_PATIENTS });
        }
    }, [dispatch, patients.length]);

    const currentPatient = patientMap[currentId] || null;
    const nextId = currentId < TOTAL_API_PATIENTS ? currentId + 1 : null;
    const nextPatient = nextId ? patientMap[nextId] || null : null;

    const handleNext = () => {
        if (currentId < TOTAL_API_PATIENTS) {
            setAnimDirection("next");
            const newId = currentId + 1;
            setTimeout(() => {
                setCurrentId(newId);
                setAnimDirection(null);
                // Prefetch the one AFTER the next
                if (newId + 1 <= TOTAL_API_PATIENTS) {
                    dispatch({ type: PREFETCH_NEXT_PATIENT, payload: newId + 1 });
                }
            }, 250);
        }
    };

    const handlePrev = () => {
        if (currentId > 1) {
            setAnimDirection("prev");
            setTimeout(() => {
                setCurrentId(currentId - 1);
                setAnimDirection(null);
            }, 250);
        }
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const isNextPrefetched = nextId && patientMap[nextId];

    return (
        <div className="card feature-card">
            <div className="card-header">
                <h3 className="card-title">
                    <div className="card-icon"><UserIcon /></div>
                    Patient List
                </h3>
                <span className="badge">
                    {currentId} / {TOTAL_API_PATIENTS}
                </span>
            </div>

            <p className="feature-desc">
                Fetches <strong>1 patient</strong> at a time from the API.
                The <strong>next patient is prefetched</strong> in the background and stored in Redux.
                Clicking "Next" shows the prefetched record <strong>instantly — no API wait</strong>.
            </p>

            {/* Redux store status bar */}
            <div className="store-status-bar">
                <span className="store-label">Redux Store:</span>
                <div className="store-dots">
                    {Array.from({ length: TOTAL_API_PATIENTS }, (_, i) => {
                        const id = i + 1;
                        const isFetched = !!patientMap[id];
                        const isCurrent = id === currentId;
                        return (
                            <div
                                key={id}
                                className={`store-dot ${isFetched ? 'fetched' : 'empty'} ${isCurrent ? 'current' : ''}`}
                                title={`Patient ${id}${isFetched ? ' (in store)' : ' (not fetched)'}`}
                            >
                                {id}
                            </div>
                        );
                    })}
                </div>
                <span className="store-count">{prefetchedIds.length} in store</span>
            </div>

            {loading && !currentPatient ? (
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                    <p>Fetching patient...</p>
                </div>
            ) : (
                <>
                    {/* Current + Prefetched cards */}
                    <div className="prefetch-viewport">
                        {/* CURRENT patient */}
                        {currentPatient && (
                            <div
                                className={`patient-card-current ${animDirection === 'next' ? 'slide-out-left' : ''} ${animDirection === 'prev' ? 'slide-out-right' : ''}`}
                                onClick={() => onPatientSelect(currentPatient.id)}
                            >
                                <div className="patient-card-label current-label">CURRENT</div>
                                <div className="list-item-avatar large-avatar">
                                    {getInitials(currentPatient.name)}
                                </div>
                                <h4 className="patient-card-name">{currentPatient.name}</h4>
                                <p className="patient-card-email">{currentPatient.email}</p>
                                <p className="patient-card-phone">📞 {currentPatient.phone?.split(' ')[0]}</p>
                                <span className="badge badge-success patient-card-badge">Click to view details</span>
                            </div>
                        )}

                        {/* PREFETCHED next patient */}
                        {nextId && (
                            <div className={`patient-card-prefetch ${isNextPrefetched ? '' : 'loading-prefetch'}`}>
                                <div className="patient-card-label prefetch-label">
                                    <ZapIcon /> {isNextPrefetched ? 'PREFETCHED' : 'PREFETCHING...'}
                                </div>

                                {isNextPrefetched ? (
                                    <>
                                        <div className="list-item-avatar prefetch-avatar">
                                            {getInitials(nextPatient.name)}
                                        </div>
                                        <h4 className="patient-card-name prefetch-name">{nextPatient.name}</h4>
                                        <p className="patient-card-email">{nextPatient.email}</p>
                                        <div className="prefetch-overlay">
                                            <span><CheckIcon /> In Redux — No API call needed</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="prefetch-loading">
                                        <div className="loading-spinner small-spinner"></div>
                                        <p>Fetching patient {nextId}...</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!nextId && (
                            <div className="patient-card-prefetch empty-prefetch">
                                <p>Last patient — no more to prefetch</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    <div className="pagination-controls">
                        <button className="btn btn-outline" onClick={handlePrev} disabled={currentId <= 1}>
                            <ChevronLeftIcon /> Prev
                        </button>
                        <span className="page-indicator">
                            Patient {currentId} of {TOTAL_API_PATIENTS}
                        </span>
                        <button className="btn btn-outline" onClick={handleNext} disabled={currentId >= TOTAL_API_PATIENTS}>
                            Next <ChevronRightIcon />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default PatientList;
