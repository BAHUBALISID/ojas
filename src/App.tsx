import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Main Website Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import WorkSection from './sections/WorkSection';
import ServicesSection from './sections/ServicesSection';
import StudioSection from './sections/StudioSection';
import CaseStudySection from './sections/CaseStudySection';
import MetricsSection from './sections/MetricsSection';
import ContactSection from './sections/ContactSection';

// Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import CertificateGenerator from './admin/CertificateGenerator';
import InvoiceGenerator from './admin/InvoiceGenerator';

gsap.registerPlugin(ScrollTrigger);

// Main Website Component
const MainWebsite = () => {
  useEffect(() => {
    // Wait for all sections to mount and create their ScrollTriggers
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();

      // Get all pinned ScrollTriggers
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);

      if (!maxScroll || pinned.length === 0) return;

      // Build ranges and snap targets from pinned sections
      const pinnedRanges = pinned.map((st) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      // Create global snap
      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            // Check if within any pinned range (allow small buffer)
            const inPinned = pinnedRanges.some(
              (r) => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value; // Flowing section: free scroll

            // Find nearest pinned center
            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative bg-charcoal min-h-screen">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Vignette */}
      <div className="vignette" />

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main className="relative">
        {/* Section 1: Hero - z-10 */}
        <HeroSection />
        
        {/* Section 2: Work - z-20 */}
        <WorkSection />
        
        {/* Section 3: Services - z-30 (flowing) */}
        <ServicesSection />
        
        {/* Section 4: Studio - z-40 */}
        <StudioSection />
        
        {/* Section 5: Case Study - z-50 */}
        <CaseStudySection />
        
        {/* Section 6: Metrics - z-60 (flowing) */}
        <MetricsSection />
        
        {/* Section 7: Contact - z-70 (flowing) */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = localStorage.getItem('ojas_admin_auth');
  return isAuth ? <>{children}</> : <Navigate to="/admin" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Website */}
        <Route path="/" element={<MainWebsite />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="certificates" element={<CertificateGenerator />} />
          <Route path="invoices" element={<InvoiceGenerator />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
