import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Route-level code splitting for production performance & bundle size optimization
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const EventsPage = lazy(() => import('./pages/EventsPage').then((m) => ({ default: m.EventsPage })));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage').then((m) => ({ default: m.EventDetailPage })));
const CalendarPage = lazy(() => import('./pages/CalendarPage').then((m) => ({ default: m.CalendarPage })));
const ClubsPage = lazy(() => import('./pages/ClubsPage').then((m) => ({ default: m.ClubsPage })));
const AnnouncementsPage = lazy(() => import('./pages/AnnouncementsPage').then((m) => ({ default: m.AnnouncementsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const EventSubmissionPage = lazy(() => import('./pages/EventSubmissionPage').then((m) => ({ default: m.EventSubmissionPage })));
const OdPortalPage = lazy(() => import('./pages/OdPortalPage').then((m) => ({ default: m.OdPortalPage })));
const AdminReviewPage = lazy(() => import('./pages/AdminReviewPage').then((m) => ({ default: m.AdminReviewPage })));
const StaffOdReviewPage = lazy(() => import('./pages/StaffOdReviewPage').then((m) => ({ default: m.StaffOdReviewPage })));
const LoginSelectionPage = lazy(() => import('./pages/LoginSelectionPage').then((m) => ({ default: m.LoginSelectionPage })));
const StudentLoginPage = lazy(() => import('./pages/StudentLoginPage').then((m) => ({ default: m.StudentLoginPage })));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const PageLoadingFallback: React.FC = () => (
  <div className="flex min-h-[50vh] items-center justify-center p-8">
    <div className="flex items-center gap-2 rounded bg-surface-container-low px-4 py-3 text-xs text-primary shadow-sm border border-amber-900/10">
      <span className="material-symbols-outlined animate-spin text-secondary text-base">progress_activity</span>
      <span className="font-title-md font-bold">Loading campus bulletin…</span>
    </div>
  </div>
);

// Scroll to top automatically when navigating between pages
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main Authenticated Application Layout with Header & Footer
const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-md text-on-surface antialiased">
      <Header />
      <main className="flex-1 pt-24 sm:pt-28">
        <Suspense fallback={<PageLoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            {/* Public Authentication Gateways - Only the clean login interface (No navbar, no search bar, no footer stats) */}
            <Route path="/login" element={<LoginSelectionPage />} />
            <Route path="/login/student" element={<StudentLoginPage />} />
            <Route path="/login/admin" element={<AdminLoginPage />} />

          {/* Protected Internal Routes - Wrapped in MainLayout with Navbar & Footer */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            {/* Student-Only: OD Portal (Admins are blocked with Access Denied) */}
            <Route
              path="/od-portal"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <OdPortalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/od"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <OdPortalPage />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Event Submission / Creation: Restricted to Staff and Admins only */}
            <Route
              path="/submit"
              element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <EventSubmissionPage />
                </ProtectedRoute>
              }
            />

            {/* Admin-Only Protected Route (Requires Admin Role) */}
            <Route
              path="/admin-review"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminReviewPage />
                </ProtectedRoute>
              }
            />

            {/* Staff-Only: OD Request Approval Desk */}
            <Route
              path="/staff-od-review"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffOdReviewPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  </BrowserRouter>
  );
};

export default App;
