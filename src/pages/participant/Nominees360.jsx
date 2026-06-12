import { useState } from 'react'
import { Link } from 'react-router-dom'

const ecDirectory = [
  { id: 'e1', name: 'Priya Menon', email: 'priya.menon@bajaj.com', designation: 'GM - Sales Strategy' },
  { id: 'e2', name: 'Vikram Sood', email: 'vikram.sood@bajaj.com', designation: 'VP - Operations' },
  { id: 'e3', name: 'Anika Kapoor', email: 'anika.kapoor@bajaj.com', designation: 'Manager - Digital Marketing' },
  { id: 'e4', name: 'Deepak Rajan', email: 'deepak.rajan@bajaj.com', designation: 'Manager - Brand Strategy' },
  { id: 'e5', name: 'Shalini Nair', email: 'shalini.nair@bajaj.com', designation: 'Senior Manager - Fleet' },
  { id: 'e6', name: 'Arjun Mehta', email: 'arjun.mehta@bajaj.com', designation: 'Senior Manager - EV Sales' },
  { id: 'e7', name: 'Kavitha S', email: 'kavitha.s@bajaj.com', designation: 'DM - Sales Analytics' },
  { id: 'e8', name: 'Ravi Kumar', email: 'ravi.kumar@bajaj.com', designation: 'DM - Sales Strategy' },
]

const REL_LABELS = {
  'reporting-manager': 'Reporting Manager',
  'skip-manager': 'Skip Manager',
  peer: 'Peer / Internal Customer',
  'direct-report': 'Direct Reportee',
}

const REL_REQUIREMENTS = {
  'reporting-manager': '1 or more',
  'skip-manager': 'Required',
  peer: 'Minimum 4',
  'direct-report': 'Optional, no cap',
}

const addableRelationships = ['reporting-manager', 'peer', 'direct-report']
const externalRelationships = ['peer', 'direct-report']

const emptyExternalDrafts = {
  'reporting-manager': { name: '', email: '' },
  peer: { name: '', email: '' },
  'direct-report': { name: '', email: '' },
}

function validate(nominees) {
  const errors = []
  if (nominees.filter((n) => n.relationship === 'reporting-manager').length < 1) errors.push('At least 1 Reporting Manager required.')
  if (nominees.filter((n) => n.relationship === 'peer').length < 4) errors.push(`At least 4 Peers required (${nominees.filter((n) => n.relationship === 'peer').length} added).`)
  return errors
}

function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2)
}

export default function Nominees360() {
  const [nominees, setNominees] = useState([
    { id: 'e1', name: 'Priya Menon', email: 'priya.menon@bajaj.com', designation: 'GM - Sales Strategy', relationship: 'reporting-manager', source: 'ec', locked: true },
    { id: 'e2', name: 'Vikram Sood', email: 'vikram.sood@bajaj.com', designation: 'VP - Operations', relationship: 'skip-manager', source: 'ec', locked: true },
  ])
  const [directorySearches, setDirectorySearches] = useState({ 'reporting-manager': '', peer: '', 'direct-report': '' })
  const [externalDrafts, setExternalDrafts] = useState(emptyExternalDrafts)
  const [submitted, setSubmitted] = useState(false)

  const errors = validate(nominees)
  const grouped = {
    'reporting-manager': nominees.filter((n) => n.relationship === 'reporting-manager'),
    'skip-manager': nominees.filter((n) => n.relationship === 'skip-manager'),
    peer: nominees.filter((n) => n.relationship === 'peer'),
    'direct-report': nominees.filter((n) => n.relationship === 'direct-report'),
  }

  function getDirectoryMatches(relationship) {
    const search = directorySearches[relationship].trim().toLowerCase()

    return ecDirectory.filter((person) => {
      const isAlreadyAdded = nominees.some((n) => n.id === person.id)
      const matchesSearch = !search || person.name.toLowerCase().includes(search) || person.designation.toLowerCase().includes(search)
      return !isAlreadyAdded && matchesSearch
    })
  }

  function updateExternalDraft(relationship, field, value) {
    setExternalDrafts((prev) => ({
      ...prev,
      [relationship]: {
        ...prev[relationship],
        [field]: value,
      },
    }))
  }

  function addExternalNominee(relationship) {
    const draft = externalDrafts[relationship]

    setNominees((prev) => [
      ...prev,
      {
        id: `ext-${relationship}-${Date.now()}`,
        name: draft.name,
        email: draft.email,
        relationship,
        source: 'external',
      },
    ])
    setExternalDrafts((prev) => ({
      ...prev,
      [relationship]: { name: '', email: '' },
    }))
  }

  function renderNominee(n) {
    const isLocked = n.locked

    return (
      <div key={n.id} className={`flex items-center gap-3 bg-white border rounded-lg px-3 py-2.5 mb-2 ${isLocked ? 'border-[#dbeafe]' : 'border-[#e2e8f0]'}`}>
        <div className="w-7 h-7 rounded-full bg-[#dbeafe] flex items-center justify-center text-[#1e4d8c] text-xs font-semibold shrink-0">{initials(n.name)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#1a1f2e] truncate">{n.name}</p>
          <p className="text-[10px] text-gray-400 truncate">{n.designation ?? n.email}</p>
        </div>
        {!isLocked && (
          <button onClick={() => setNominees((prev) => prev.filter((x) => x.id !== n.id))} className="text-gray-300 hover:text-red-400 ml-1">x</button>
        )}
      </div>
    )
  }

  function renderAddControls(relationship) {
    if (!addableRelationships.includes(relationship)) return null

    const matches = getDirectoryMatches(relationship)
    const draft = externalDrafts[relationship]
    const canAddExternal = draft.name.trim() && draft.email.trim()

    return (
      <div className="mt-3 rounded-lg border border-[#e2e8f0] bg-[#f8f9fc] p-3">
        <div className="mb-3">
          <p className="text-xs font-semibold text-[#1a1f2e] mb-2">Add from Employee Directory</p>
          <input
            type="text"
            placeholder={`Search ${REL_LABELS[relationship].toLowerCase()} by name or designation...`}
            value={directorySearches[relationship]}
            onChange={(e) => setDirectorySearches((prev) => ({ ...prev, [relationship]: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e4d8c] mb-2"
          />
          <div className="space-y-1.5 max-h-44 overflow-y-auto">
            {matches.map((person) => (
              <button
                key={person.id}
                onClick={() => setNominees((prev) => [...prev, { ...person, relationship, source: 'ec' }])}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white hover:bg-[#f1f4f9] transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-semibold shrink-0">{initials(person.name)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#1a1f2e]">{person.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{person.designation}</p>
                </div>
                <span className="text-[#1e4d8c] text-lg shrink-0">+</span>
              </button>
            ))}
            {matches.length === 0 && <p className="text-xs text-gray-300 italic text-center py-3">No more employees to add</p>}
          </div>
        </div>

        {externalRelationships.includes(relationship) && (
          <div className="border-t border-[#e2e8f0] pt-3">
            <p className="text-xs font-semibold text-[#1a1f2e] mb-1">Add External Respondent</p>
            <p className="text-[10px] text-gray-400 mb-2">For stakeholders outside Bajaj Auto.</p>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
              <input
                type="text"
                placeholder="Full name"
                value={draft.name}
                onChange={(e) => updateExternalDraft(relationship, 'name', e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e4d8c]"
              />
              <input
                type="email"
                placeholder="Email address"
                value={draft.email}
                onChange={(e) => updateExternalDraft(relationship, 'email', e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e4d8c]"
              />
              <button
                disabled={!canAddExternal}
                onClick={() => addExternalNominee(relationship)}
                className="px-4 py-2 rounded-lg border border-[#1e4d8c] text-[#1e4d8c] text-sm font-medium hover:bg-[#dbeafe] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  function getVisibleRequirement(rel) {
    if (rel === 'reporting-manager' && grouped['reporting-manager'].length >= 1) return null
    if (rel === 'peer' && grouped.peer.length >= 4) return null
    if (rel === 'skip-manager') return null
    return REL_REQUIREMENTS[rel]
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link to="/participant/dashboard" className="hover:text-gray-600">Dashboard</Link>
        <span>/</span>
        <span className="text-[#1a1f2e]">360 Nominees</span>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#1a1f2e]">360 Nominee Submission</h1>
        <p className="text-xs text-gray-400 mt-1">Current Reporting Manager and Skip Manager cannot be changed here. Previous Reporting Managers can be added below.</p>
        <p className="text-sm text-gray-500 mt-0.5">Select respondents who will provide feedback on your behaviours - Due 20 Jun 2025</p>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-green-800 mb-1">Nominees submitted ({nominees.length} respondents)</h3>
          <p className="text-xs text-green-600">360 invites will be dispatched. Your BUHR can view this list.</p>
          <Link to="/participant/dashboard" className="mt-4 inline-block text-xs text-[#1e4d8c] font-medium hover:underline">Back to Dashboard</Link>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-sm font-semibold text-[#1a1f2e] uppercase tracking-wide">Selected Nominees</h2>
            <p className="text-sm font-semibold text-[#1e4d8c]">{nominees.length} total nominees</p>
          </div>

          <div className="bg-[#f1f4f9] rounded-lg p-3 mb-4 space-y-1">
            {[
              { label: 'Reporting Manager', detail: REL_REQUIREMENTS['reporting-manager'], ok: grouped['reporting-manager'].length >= 1 },
              { label: 'Skip Manager', detail: REL_REQUIREMENTS['skip-manager'], ok: grouped['skip-manager'].length === 1 },
              { label: 'Peers / Internal Customers', detail: REL_REQUIREMENTS.peer, ok: grouped.peer.length >= 4 },
              { label: 'Direct Reportees', detail: REL_REQUIREMENTS['direct-report'], ok: true },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${r.ok ? 'bg-green-500' : 'bg-red-400'}`} />
                  <span className="text-xs text-gray-600">{r.label}</span>
                </div>
                <span className="text-xs text-gray-400">{r.detail}</span>
              </div>
            ))}
          </div>

          <div className="space-y-5">
            {Object.keys(grouped).map((rel) => (
              <div key={rel} className="rounded-xl border border-[#e2e8f0] bg-white p-4">
                {(() => {
                  const visibleRequirement = getVisibleRequirement(rel)

                  return (
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{REL_LABELS[rel]}</p>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">{grouped[rel].length} added</p>
                    {visibleRequirement && (
                      <p className={`text-xs font-semibold ${rel === 'peer' || rel === 'reporting-manager' ? 'text-red-500' : 'text-[#1e4d8c]'}`}>{visibleRequirement}</p>
                    )}
                  </div>
                </div>
                  )
                })()}
                {grouped[rel].length === 0
                  ? <p className="text-xs text-gray-300 italic pl-1">None added</p>
                  : grouped[rel].map(renderNominee)
                }
                {renderAddControls(rel)}
              </div>
            ))}
          </div>

          {errors.length > 0 && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
              {errors.map((e) => <p key={e} className="text-xs text-red-600">! {e}</p>)}
            </div>
          )}

          <button
            disabled={errors.length > 0}
            onClick={() => setSubmitted(true)}
            className="mt-5 w-full py-2.5 rounded-lg bg-[#1e4d8c] text-white text-sm font-medium hover:bg-[#183f73] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Nominees
          </button>
        </div>
      )}
    </div>
  )
}
