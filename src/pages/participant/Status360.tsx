import { Link } from 'react-router-dom'

const respondents = [
  { name: 'Priya Menon', relationship: 'Reporting Manager', status: 'submitted', submittedOn: '12 Jun 2025' },
  { name: 'Vikram Sood', relationship: 'Skip Manager', status: 'submitted', submittedOn: '14 Jun 2025' },
  { name: 'Rahul Kumar (Self)', relationship: 'Self', status: 'submitted', submittedOn: '10 Jun 2025' },
  { name: 'Anika Kapoor', relationship: 'Peer', status: 'submitted', submittedOn: '13 Jun 2025' },
  { name: 'Deepak Rajan', relationship: 'Peer', status: 'pending', submittedOn: null },
  { name: 'Shalini Nair', relationship: 'Peer', status: 'pending', submittedOn: null },
  { name: 'Arjun Mehta', relationship: 'Peer', status: 'pending', submittedOn: null },
  { name: 'Kavitha S', relationship: 'Peer', status: 'pending', submittedOn: null },
]

const submitted = respondents.filter((r) => r.status === 'submitted').length
const total = respondents.length
const pct = Math.round((submitted / total) * 100)

function initials(name: string) {
  if (name === 'Rahul Kumar (Self)') return 'ME'
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2)
}

export default function Status360() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link to="/participant/dashboard" className="hover:text-gray-600">Dashboard</Link>
        <span>/</span>
        <span className="text-[#1a1f2e]">360 Status</span>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#1a1f2e]">360 Feedback Status</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track who has submitted · Cutoff: 30 Jun 2025</p>
      </div>

      <div className="bg-[#1e4d8c] rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-200 text-sm">Responses received</p>
            <p className="text-3xl font-bold mt-0.5">{submitted} <span className="text-blue-300 text-lg font-normal">/ {total}</span></p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{pct}%</p>
            <p className="text-blue-200 text-xs mt-0.5">Complete</p>
          </div>
        </div>
        <div className="w-full bg-blue-800 rounded-full h-2 mb-2">
          <div className="bg-white rounded-full h-2" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-blue-300 mt-1">
          <span>{total - submitted} pending</span>
          <span>Cutoff: 30 Jun 2025</span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 flex items-start gap-2.5">
        <span className="text-amber-500 mt-0.5">ⓘ</span>
        <p className="text-xs text-amber-700">
          You can see <strong>who</strong> has submitted but not their individual responses. All feedback is aggregated to protect confidentiality.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#f1f4f9]">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Respondents</p>
        </div>
        <div className="divide-y divide-[#f1f4f9]">
          {respondents.map((r) => (
            <div key={r.name} className="flex items-center gap-4 px-5 py-3.5">
              <div className="w-8 h-8 rounded-full bg-[#f1f4f9] flex items-center justify-center text-gray-500 text-xs font-semibold shrink-0">
                {initials(r.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a1f2e]">{r.name === 'Rahul Kumar (Self)' ? 'You (Self)' : r.name}</p>
                <p className="text-xs text-gray-400">{r.relationship}</p>
              </div>
              <div className="text-right shrink-0">
                {r.status === 'submitted' ? (
                  <div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">✓ Submitted</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{r.submittedOn}</p>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">⏳ Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Your 360 report will be auto-generated once all responses are in or the cutoff date passes.
      </p>
    </div>
  )
}
