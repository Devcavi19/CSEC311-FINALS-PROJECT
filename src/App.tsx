import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// User pages
import UserMain from './pages/user/UserMain';
import BookTicket from './pages/user/BookTicket';
import MyTickets from './pages/user/MyTickets';

// Admin pages
import AdminMain from './pages/admin/AdminMain';
import ViewUsers from './pages/admin/users/ViewUsers';
import CreateUser from './pages/admin/users/CreateUser';
import EditUser from './pages/admin/users/EditUser';
import ViewBuses from './pages/admin/buses/ViewBuses';
import AddBus from './pages/admin/buses/AddBus';
import EditBus from './pages/admin/buses/EditBus';
import ViewDestinations from './pages/admin/destinations/ViewDestinations';
import AddDestination from './pages/admin/destinations/AddDestination';
import EditDestination from './pages/admin/destinations/EditDestination';
import ViewBookings from './pages/admin/bookings/ViewBookings';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './design-system.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User routes */}
              <Route path="/user" element={
                <ProtectedRoute>
                  <UserMain />
                </ProtectedRoute>
              } />
              <Route path="/book" element={
                <ProtectedRoute>
                  <BookTicket />
                </ProtectedRoute>
              } />
              <Route path="/my-tickets" element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminMain />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin>
                  <ViewUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/users/create" element={
                <ProtectedRoute requireAdmin>
                  <CreateUser />
                </ProtectedRoute>
              } />
              <Route path="/admin/users/edit/:id" element={
                <ProtectedRoute requireAdmin>
                  <EditUser />
                </ProtectedRoute>
              } />
              <Route path="/admin/buses" element={
                <ProtectedRoute requireAdmin>
                  <ViewBuses />
                </ProtectedRoute>
              } />
              <Route path="/admin/buses/add" element={
                <ProtectedRoute requireAdmin>
                  <AddBus />
                </ProtectedRoute>
              } />
              <Route path="/admin/buses/edit/:id" element={
                <ProtectedRoute requireAdmin>
                  <EditBus />
                </ProtectedRoute>
              } />
              <Route path="/admin/destinations" element={
                <ProtectedRoute requireAdmin>
                  <ViewDestinations />
                </ProtectedRoute>
              } />
              <Route path="/admin/destinations/add" element={
                <ProtectedRoute requireAdmin>
                  <AddDestination />
                </ProtectedRoute>
              } />
              <Route path="/admin/destinations/edit/:id" element={
                <ProtectedRoute requireAdmin>
                  <EditDestination />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute requireAdmin>
                  <ViewBookings />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
