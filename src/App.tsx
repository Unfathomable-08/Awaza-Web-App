import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authContext';
import AccountSetting from './pages/AccountSetting';
import Chat from './pages/Chat';
import CheckEmail from './pages/CheckEmail';
import CommentDetails from './pages/CommentDetails';
import ComposePost from './pages/ComposePost';
import Home from './pages/Home';
import Inbox from './pages/Inbox';
import Login from './pages/Login';
import PostDetails from './pages/PostDetails';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import UpdateProfile from './pages/UpdateProfile';
import UpdateUsername from './pages/UpdateUsername';
import Welcome from './pages/Welcome';

const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/home" : "/welcome"} replace />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/home" element={user ? <Home /> : <Navigate to="/welcome" replace />} />
      <Route path="/post/:id" element={user ? <PostDetails /> : <Navigate to="/login" replace />} />
      <Route path="/comment/:id" element={user ? <CommentDetails /> : <Navigate to="/login" replace />} />
      <Route path="/profile/:userId" element={user ? <Profile /> : <Navigate to="/login" replace />} />
      <Route path="/compose-post" element={user ? <ComposePost /> : <Navigate to="/login" replace />} />
      <Route path="/inbox" element={user ? <Inbox /> : <Navigate to="/login" replace />} />
      <Route path="/chat/:username" element={user ? <Chat /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={user ? <AccountSetting /> : <Navigate to="/login" replace />} />
      <Route path="/update-profile" element={user ? <UpdateProfile /> : <Navigate to="/login" replace />} />
      <Route path="/update-username" element={user ? <UpdateUsername /> : <Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
