import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FETCH_PATIENTS,
    FETCH_PATIENTS_PAGE,
    PREFETCH_PATIENTS_PAGE,
    SHOW_PREFETCHED_PAGE,
} from "../redux/actions";

/* Icons */
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const ChevronLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ChevronRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>);
const ZapIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);

function PatientList({ onPatientSelect }) {
    const dispatch = useDispatch();
    const currentPageData = useSelector(state => state.currentPageData);
    const prefetchedPageData = useSelector(state => state.prefetchedPageData);
    const currentPage = useSelector(state => state.currentPage);
    const prefetchedPage = useSelector(state => state.prefetchedPage);
    const totalPages = useSelector(state => state.totalPages);
    const loading = useSelector(state => state.loading);
    const patients = useSelector(state => state.patients);

    const [animDirection, setAnimDirection] = useState(null);
    // Cache for previously viewed pages (for "Prev" navigation)
    const [pageCache, setPageCache] = useState({});

    // On mount: fetch page 1 + prefetch page 2
    useEffect(() => {
        dispatch({ type: FETCH_PATIENTS_PAGE, payload: 1 });
        dispatch({ type: PREFETCH_PATIENTS_PAGE, payload: 2 });
        // Also fetch all patients for the stats bar count
        if (patients.length === 0) {
            dispatch({ type: FETCH_PATIENTS });
        }
    }, [dispatch, patients.length]);

    // Cache the current page whenever it changes
    useEffect(() => {
        if (currentPage > 0 && currentPageData.length > 0) {
            setPageCache(prev => ({ ...prev, [currentPage]: currentPageData }));
        }
    }, [currentPage, currentPageData]);

    const isPrefetched = prefetchedPageData.length > 0;
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;

    const handleNext = () => {
        if (!hasNext) return;

        setAnimDirection("next");
        setTimeout(() => {
            if (isPrefetched) {
                // Prefetched data exists → show it instantly
                dispatch({ type: SHOW_PREFETCHED_PAGE });
            } else {
                // No prefetched data → fetch normally
                dispatch({ type: FETCH_PATIENTS_PAGE, payload: currentPage + 1 });
            }
            // Prefetch the page AFTER the next one
            const nextPrefetchPage = currentPage + 2;
            if (nextPrefetchPage <= totalPages) {
                dispatch({ type: PREFETCH_PATIENTS_PAGE, payload: nextPrefetchPage });
            }
            setAnimDirection(null);
        }, 250);
    };

    const handlePrev = () => {
        if (!hasPrev) return;

        setAnimDirection("prev");
        const prevPage = currentPage - 1;
        setTimeout(() => {
            // Check page cache first
            if (pageCache[prevPage]) {
                dispatch({
                    type: "SET_PATIENTS_PAGE",
                    payload: { patients: pageCache[prevPage], page: prevPage, totalPages: totalPages }
                });
            } else {
                dispatch({ type: FETCH_PATIENTS_PAGE, payload: prevPage });
            }
            setAnimDirection(null);
        }, 250);
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="card feature-card">
            <div className="card-header">
                <h3 className="card-title">
                    <div className="card-icon"><UserIcon /></div>
                    Patient List
                </h3>
                <span className="badge">
                    Page {currentPage} / {totalPages}
                </span>
            </div>

            <p className="feature-desc">
                Displays <strong>3 patients</strong> per page from a <strong>dummy API</strong> (no axios).
                The <strong>next 3 are prefetched</strong> in the background and stored in Redux.
                Clicking "Next" shows the prefetched records <strong>instantly — no API wait</strong>.
            </p>

            {/* Prefetch status indicator */}
            <div className="store-status-bar">
                <span className="store-label">Pages:</span>
                <div className="store-dots">
                    {Array.from({ length: totalPages }, (_, i) => {
                        const page = i + 1;
                        const isCurrent = page === currentPage;
                        const isPrefetchedPage = page === prefetchedPage;
                        const isCached = !!pageCache[page];
                        return (
                            <div
                                key={page}
                                className={`store-dot ${isCurrent ? 'current' : ''} ${isPrefetchedPage ? 'fetched' : ''} ${isCached && !isCurrent ? 'fetched' : ''} ${!isCurrent && !isPrefetchedPage && !isCached ? 'empty' : ''}`}
                                title={`Page ${page}${isCurrent ? ' (current)' : ''}${isPrefetchedPage ? ' (prefetched)' : ''}${isCached ? ' (cached)' : ''}`}
                            >
                                {page}
                            </div>
                        );
                    })}
                </div>
                <span className="store-count">
                    {isPrefetched ? (
                        <><CheckIcon /> Next page prefetched</>
                    ) : (
                        "No prefetch"
                    )}
                </span>
            </div>

            {loading && currentPageData.length === 0 ? (
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                    <p>Fetching patients...</p>
                </div>
            ) : (
                <>
                    {/* Current page – 3 patient cards */}
                    <div className={`prefetch-viewport ${animDirection === 'next' ? 'slide-out-left' : ''} ${animDirection === 'prev' ? 'slide-out-right' : ''}`}>
                        <div className="patient-cards-grid">
                            {currentPageData.map((patient) => (
                                <div
                                    key={patient.id}
                                    className="patient-card-current"
                                    onClick={() => onPatientSelect(patient.id)}
                                >
                                    <div className="list-item-avatar large-avatar">
                                        {getInitials(patient.name)}
                                    </div>
                                    <h4 className="patient-card-name">{patient.name}</h4>
                                    <p className="patient-card-email">{patient.email}</p>
                                    <p className="patient-card-phone">📞 {patient.phone?.split(' ')[0]}</p>
                                    <span className="badge badge-success patient-card-badge">Click to view details</span>
                                </div>
                            ))}
                        </div>

                        {/* Prefetch status card */}
                        {hasNext && (
                            <div className={`prefetch-indicator ${isPrefetched ? 'ready' : 'loading-prefetch'}`}>
                                <ZapIcon />
                                <span>
                                    {isPrefetched
                                        ? `Next 3 patients (Page ${prefetchedPage}) are prefetched & ready in Redux`
                                        : "Prefetching next page..."}
                                </span>
                                {isPrefetched && <CheckIcon />}
                            </div>
                        )}

                        {!hasNext && (
                            <div className="prefetch-indicator no-more">
                                <span>Last page — no more patients to prefetch</span>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    <div className="pagination-controls">
                        <button className="btn btn-outline" onClick={handlePrev} disabled={!hasPrev}>
                            <ChevronLeftIcon /> Prev
                        </button>
                        <span className="page-indicator">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button className="btn btn-outline" onClick={handleNext} disabled={!hasNext}>
                            Next <ChevronRightIcon />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default PatientList;