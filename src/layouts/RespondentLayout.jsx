import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const navItems = [
  { to: '/respondent/dashboard', label: 'My Feedback Tasks', icon: TasksIcon },
]

function TasksIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8h6m-6 4h4" />
    </svg>
  )
}

export default function RespondentLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, switchRole, pendingParticipantCount } = useUser()

  const isParticipantToo = user.roles.includes('participant')

  function handleSwitchToParticipant() {
    switchRole('participant')
    navigate('/participant/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-[#f8f9fc]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-white border-r border-[#e2e8f0] flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1e4d8c] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1a1f2e] leading-tight">Bajaj Auto</p>
              <p className="text-[10px] text-gray-400 leading-tight">DC Tool</p>
            </div>
          </div>
        </div>

        {/* Active role pill */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-violet-50 border border-violet-200 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
            <span className="text-[11px] font-semibold text-violet-700 tracking-wide">360 Respondent</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-violet-50 text-violet-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#1a1f2e]'
                }`}
              >
                <Icon />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Switch to participant view */}
        {isParticipantToo && (
          <div className="px-3 pb-2 border-t border-[#e2e8f0] pt-3">
            <button
              onClick={handleSwitchToParticipant}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-[#e2e8f0] bg-[#f8f9fc] hover:bg-[#dbeafe] hover:border-[#bfdbfe] transition-colors group"
            >
              <div className="w-6 h-6 rounded-full bg-[#1e4d8c] flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-medium text-[#1a1f2e] group-hover:text-[#1e4d8c]">Switch to Participant</p>
                {pendingParticipantCount > 0 && (
                  <p className="text-[10px] text-amber-600">{pendingParticipantCount} pending tasks</p>
                )}
              </div>
              <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1e4d8c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* User card */}
        <div className="px-3 py-4 border-t border-[#e2e8f0]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#1e4d8c] flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {user.initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#1a1f2e] truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user.employeeId}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-1.5 mt-1 text-xs text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors w-full"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1 overflow-auto">
        {/* Participant pending alert */}
        {isParticipantToo && pendingParticipantCount > 0 && (
          <ParticipantAlert count={pendingParticipantCount} onSwitch={handleSwitchToParticipant} />
        )}
        <Outlet />
      </main>
    </div>
  )
}

function ParticipantAlert({ count, onSwitch }) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-3">
      <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <p className="text-xs text-amber-700 flex-1">
        Your DC journey has <span className="font-semibold">{count} pending tasks</span> — don't let your own deadlines slip while you fill feedback.
      </p>
      <button
        onClick={onSwitch}
        className="text-xs font-medium text-amber-700 hover:text-amber-900 underline underline-offset-2 shrink-0"
      >
        Go to Participant View →
      </button>
    </div>
  )
}
