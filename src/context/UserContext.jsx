import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

const MOCK_USER = {
  name: 'Rahul Kumar',
  initials: 'RK',
  employeeId: 'EX-78432',
  designation: 'Senior Manager',
  bu: 'Two-Wheeler',
  level: 'EX',
  cohort: "EX-to-LX Cohort '25",
  reportingManager: 'Priya Menon',
  dcType: 'EX to LX',
  // This user is both a DC participant AND a 360 respondent for others
  roles: ['participant', 'respondent'],
  respondentTasks: [
    {
      id: 'r1',
      participantName: 'Neha Sharma',
      participantInitials: 'NS',
      designation: 'Senior Manager',
      bu: 'EV & New Businesses',
      relationship: 'Peer / Internal Customer',
      dcType: 'EX-to-LX',
      status: 'pending',
      progress: 0,
      totalQuestions: 38,
      answered: 0,
      deadline: '30 Jun 2025',
    },
    {
      id: 'r2',
      participantName: 'Arjun Patel',
      participantInitials: 'AP',
      designation: 'Deputy Manager',
      bu: 'Two-Wheeler (Sales)',
      relationship: 'Peer / Internal Customer',
      dcType: 'EX-to-LX',
      status: 'saved',
      progress: 61,
      totalQuestions: 38,
      answered: 23,
      deadline: '30 Jun 2025',
    },
    {
      id: 'r3',
      participantName: 'Sunita Rao',
      participantInitials: 'SR',
      designation: 'Manager',
      bu: 'Finance',
      relationship: 'Reporting Manager',
      dcType: 'EX-to-LX',
      status: 'submitted',
      progress: 100,
      totalQuestions: 42,
      answered: 42,
      deadline: '30 Jun 2025',
    },
  ],
}

export function UserProvider({ children }) {
  const [user] = useState(MOCK_USER)
  const [activeRole, setActiveRole] = useState('participant')

  const switchRole = (role) => {
    if (user.roles.includes(role)) setActiveRole(role)
  }

  const pendingRespondentCount = user.respondentTasks.filter(
    (t) => t.status === 'pending' || t.status === 'saved'
  ).length

  const pendingParticipantCount = 2 // mock: Pre-Work + 360 Nominees

  return (
    <UserContext.Provider value={{ user, activeRole, switchRole, pendingRespondentCount, pendingParticipantCount }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}
