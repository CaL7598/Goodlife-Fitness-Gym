
import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Member, 
  PaymentRecord, 
  Announcement, 
  GalleryImage,
  SubscriptionPlan,
  PaymentMethod,
  PaymentStatus
} from './types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_PAYMENTS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_GALLERY 
} from './constants';

// UI Components
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import PublicHome from './pages/PublicHome';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';
import MembershipPlans from './pages/MembershipPlans';
import AdminDashboard from './pages/AdminDashboard';
import MemberManager from './pages/MemberManager';
import PaymentProcessor from './pages/PaymentProcessor';
import SubscriptionTracker from './pages/SubscriptionTracker';
import CommunicationCenter from './pages/CommunicationCenter';
import ContentManager from './pages/ContentManager';
import AdminLogin from './pages/AdminLogin';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.PUBLIC);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // App State (Mock DB)
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS as Member[]);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS as PaymentRecord[]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS as Announcement[]);
  const [gallery, setGallery] = useState<GalleryImage[]>(INITIAL_GALLERY as GalleryImage[]);

  // Simple Router
  const renderPage = () => {
    if (userRole === UserRole.PUBLIC) {
      switch (currentPage) {
        case 'home': return <PublicHome setCurrentPage={setCurrentPage} />;
        case 'about': return <About />;
        case 'gallery': return <Gallery gallery={gallery} />;
        case 'announcements': return <Announcements announcements={announcements} />;
        case 'contact': return <Contact />;
        case 'plans': return <MembershipPlans />;
        case 'admin-login': return <AdminLogin onLogin={(role) => {
          setUserRole(role);
          setIsAdminLoggedIn(true);
          setCurrentPage('dashboard');
        }} />;
        default: return <PublicHome setCurrentPage={setCurrentPage} />;
      }
    } else {
      // Admin Pages
      switch (currentPage) {
        case 'dashboard': return <AdminDashboard members={members} payments={payments} role={userRole} />;
        case 'members': return <MemberManager members={members} setMembers={setMembers} role={userRole} />;
        case 'payments': return <PaymentProcessor payments={payments} setPayments={setPayments} members={members} role={userRole} />;
        case 'subscriptions': return <SubscriptionTracker members={members} setMembers={setMembers} role={userRole} />;
        case 'communications': return <CommunicationCenter members={members} />;
        case 'content': return <ContentManager 
          announcements={announcements} 
          setAnnouncements={setAnnouncements} 
          gallery={gallery} 
          setGallery={setGallery} 
          role={userRole} 
        />;
        default: return <AdminDashboard members={members} payments={payments} role={userRole} />;
      }
    }
  };

  const handleLogout = () => {
    setUserRole(UserRole.PUBLIC);
    setIsAdminLoggedIn(false);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen">
      {userRole === UserRole.PUBLIC ? (
        <PublicLayout setCurrentPage={setCurrentPage} currentPage={currentPage}>
          {renderPage()}
        </PublicLayout>
      ) : (
        <AdminLayout 
          setCurrentPage={setCurrentPage} 
          currentPage={currentPage} 
          role={userRole}
          onLogout={handleLogout}
        >
          {renderPage()}
        </AdminLayout>
      )}
    </div>
  );
};

export default App;
