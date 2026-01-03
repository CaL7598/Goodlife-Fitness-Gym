
import React, { useState, useEffect, useCallback } from 'react';
import { 
  UserRole, 
  Member, 
  StaffMember,
  PaymentRecord, 
  Announcement, 
  GalleryImage,
  SubscriptionPlan,
  PaymentMethod,
  PaymentStatus,
  ActivityLog,
  AttendanceRecord
} from './types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_STAFF,
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
import ActivityLogs from './pages/ActivityLogs';
import AttendanceManager from './pages/AttendanceManager';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.PUBLIC);
  const [userEmail, setUserEmail] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // App State (Mock DB)
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS as Member[]);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF as StaffMember[]);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS as PaymentRecord[]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS as Announcement[]);
  const [gallery, setGallery] = useState<GalleryImage[]>(INITIAL_GALLERY as GalleryImage[]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  const logActivity = useCallback((action: string, details: string, category: 'access' | 'admin' | 'financial') => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userRole,
      userEmail,
      action,
      details,
      timestamp: new Date().toISOString(),
      category
    };
    setActivityLogs(prev => [newLog, ...prev]);
  }, [userRole, userEmail]);

  const handleShiftSignIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      staffEmail: userEmail,
      staffRole: userRole,
      date: today,
      signInTime: new Date().toISOString()
    };
    setAttendanceRecords(prev => [newRecord, ...prev]);
    logActivity('Shift Sign In', `Staff member signed in for their work shift`, 'access');
  };

  const handleShiftSignOut = () => {
    const today = new Date().toISOString().split('T')[0];
    setAttendanceRecords(prev => prev.map(rec => {
      if (rec.staffEmail === userEmail && rec.date === today && !rec.signOutTime) {
        return { ...rec, signOutTime: new Date().toISOString() };
      }
      return rec;
    }));
    logActivity('Shift Sign Out', `Staff member signed out and closed their work shift`, 'access');
  };

  const isOnShift = attendanceRecords.some(r => r.staffEmail === userEmail && r.date === new Date().toISOString().split('T')[0] && !r.signOutTime);

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
        case 'admin-login': return <AdminLogin onLogin={(role, email) => {
          setUserRole(role);
          setUserEmail(email);
          setIsAdminLoggedIn(true);
          setCurrentPage('dashboard');
        }} logActivity={logActivity} />;
        default: return <PublicHome setCurrentPage={setCurrentPage} />;
      }
    } else {
      // Admin Pages
      switch (currentPage) {
        case 'dashboard': return (
          <AdminDashboard 
            members={members} 
            payments={payments} 
            role={userRole} 
            staff={staff}
            attendanceRecords={attendanceRecords}
            activityLogs={activityLogs}
          />
        );
        case 'members': return <MemberManager members={members} setMembers={setMembers} role={userRole} logActivity={logActivity} />;
        case 'payments': return <PaymentProcessor payments={payments} setPayments={setPayments} members={members} role={userRole} logActivity={logActivity} />;
        case 'subscriptions': return <SubscriptionTracker members={members} setMembers={setMembers} role={userRole} logActivity={logActivity} />;
        case 'communications': return <CommunicationCenter members={members} />;
        case 'activity-logs': return <ActivityLogs logs={activityLogs} />;
        case 'attendance': return <AttendanceManager records={attendanceRecords} currentUserEmail={userEmail} role={userRole} />;
        case 'content': return <ContentManager 
          announcements={announcements} 
          setAnnouncements={setAnnouncements} 
          gallery={gallery} 
          setGallery={setGallery} 
          role={userRole} 
        />;
        default: return <AdminDashboard members={members} payments={payments} role={userRole} staff={staff} attendanceRecords={attendanceRecords} activityLogs={activityLogs} />;
      }
    }
  };

  const handleLogout = () => {
    logActivity('Logout', 'User signed out of the portal', 'access');
    setUserRole(UserRole.PUBLIC);
    setUserEmail('');
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
          isOnShift={isOnShift}
          onShiftSignIn={handleShiftSignIn}
          onShiftSignOut={handleShiftSignOut}
        >
          {renderPage()}
        </AdminLayout>
      )}
    </div>
  );
};

export default App;
