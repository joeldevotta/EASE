import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { CalendarPage } from './pages/CalendarPage';
import { ClubsPage } from './pages/ClubsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { EventSubmissionPage } from './pages/EventSubmissionPage';
import { OdPortalPage } from './pages/OdPortalPage';
import { AdminReviewPage } from './pages/AdminReviewPage';
import { StaffOdReviewPage } from './pages/StaffOdReviewPage';
import { LoginSelectionPage } from './pages/LoginSelectionPage';
import { StudentLoginPage } from './pages/StudentLoginPage';
import { StudentRegisterPage } from './pages/StudentRegisterPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

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
        <Outlet />
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
        <Routes>
          {/* Public Authentication Gateways - Only the clean login interface (No navbar, no search bar, no footer stats) */}
          <Route path="/login" element={<LoginSelectionPage />} />
          <Route path="/login/student" element={<StudentLoginPage />} />
          <Route path="/register/student" element={<StudentRegisterPage />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
