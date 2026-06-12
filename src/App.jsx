import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import LoginPage from './pages/Login'

// Participant
import ParticipantLayout from './layouts/ParticipantLayout'
import Dashboard from './pages/participant/Dashboard'
import RoleInterview from './pages/participant/RoleInterview'
import Photograph from './pages/participant/Photograph'
import PreWork from './pages/participant/PreWork'
import Nominees360 from './pages/participant/Nominees360'
import Status360 from './pages/participant/Status360'
import Reports from './pages/participant/Reports'

// Respondent
import RespondentLayout from './layouts/RespondentLayout'
import RespondentDashboard from './pages/respondent/Dashboard'
import FeedbackForm from './pages/respondent/FeedbackForm'

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/participant" element={<ParticipantLayout />}>
          <Route index element={<Navigate to="/participant/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="role-interview" element={<RoleInterview />} />
          <Route path="photograph" element={<Photograph />} />
          <Route path="pre-work" element={<PreWork />} />
          <Route path="360-nominees" element={<Nominees360 />} />
          <Route path="360-status" element={<Status360 />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        <Route path="/respondent" element={<RespondentLayout />}>
          <Route index element={<Navigate to="/respondent/dashboard" replace />} />
          <Route path="dashboard" element={<RespondentDashboard />} />
          <Route path="feedback/:taskId" element={<FeedbackForm />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserProvider>
  )
}
