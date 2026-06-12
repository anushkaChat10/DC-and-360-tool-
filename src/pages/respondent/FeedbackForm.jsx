import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

// Mock question bank – Peer variant (EX-to-LX DC)
const COMPETENCY_SECTIONS = [
  {
    id: 'c1',
    title: 'Aligns & Motivates Teams for High Performance',
    behaviours: [
      { id: 'b1', text: 'Elicits, understands and negotiates brief from stakeholders' },
      { id: 'b2', text: 'Communicates vision and articulates goals to the team' },
      { id: 'b3', text: 'Encourages and challenges the team towards higher levels of performance' },
      { id: 'b4', text: 'Champions the desired behaviour and calls out undesired behaviour' },
      { id: 'b5', text: 'Recognises and rewards contributions that align with team goals' },
    ],
  },
  {
    id: 'c2',
    title: 'Collaborates with All Interfaces',
    behaviours: [
      { id: 'b6', text: 'Identifies and develops credibility with critical stakeholders' },
      { id: 'b7', text: 'Maintains relations to get commitment for achieving results' },
      { id: 'b8', text: 'Navigates conflicts constructively and brings parties to resolution' },
      { id: 'b9', text: 'Proactively shares information across teams to enable collaboration' },
    ],
  },
  {
    id: 'c3',
    title: 'Drives Execution & Results',
    behaviours: [
      { id: 'b10', text: 'Sets clear priorities and ensures the team delivers on commitments' },
      { id: 'b11', text: 'Removes obstacles that block team progress' },
      { id: 'b12', text: 'Maintains accountability for outcomes even under pressure' },
      { id: 'b13', text: 'Tracks progress rigorously and course-corrects when needed' },
    ],
  },
  {
    id: 'c4',
    title: 'Builds & Develops Talent',
    behaviours: [
      { id: 'b14', text: 'Provides timely, honest and constructive feedback to peers and team' },
      { id: 'b15', text: 'Creates opportunities for others to grow and take on stretch work' },
      { id: 'b16', text: 'Coaches rather than directs when others face challenges' },
    ],
  },
  {
    id: 'c5',
    title: 'Strategic Thinking & Business Acumen',
    behaviours: [
      { id: 'b17', text: 'Connects day-to-day actions to the broader business direction' },
      { id: 'b18', text: 'Identifies emerging risks and opportunities before they become obvious' },
      { id: 'b19', text: 'Makes well-reasoned decisions when faced with ambiguity' },
    ],
  },
]

const TOTAL_BEHAVIOURS = COMPETENCY_SECTIONS.reduce((acc, s) => acc + s.behaviours.length, 0)

const RATING_LABELS = {
  1: 'Rarely',
  2: 'Occasionally',
  3: 'Often',
  4: 'Almost Always',
  NA: 'N/A',
}

function RatingButton({ value, selected, onChange }) {
  const isNA = value === 'NA'
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`w-10 h-8 rounded-md text-xs font-semibold transition-all border ${
        selected
          ? isNA
            ? 'bg-gray-500 text-white border-gray-500'
            : 'bg-[#1e4d8c] text-white border-[#1e4d8c]'
          : 'bg-white text-gray-500 border-[#e2e8f0] hover:border-[#1e4d8c] hover:text-[#1e4d8c]'
      }`}
      title={RATING_LABELS[value]}
    >
      {isNA ? 'NA' : value}
    </button>
  )
}

function BehaviourRow({ behaviour, rating, onChange, index }) {
  return (
    <div className={`flex items-center gap-4 py-3 ${index > 0 ? 'border-t border-[#f1f4f9]' : ''}`}>
      <p className="flex-1 text-sm text-[#1a1f2e] leading-snug pr-2">{behaviour.text}</p>
      <div className="flex items-center gap-1.5 shrink-0">
        {[1, 2, 3, 4, 'NA'].map((v) => (
          <RatingButton key={v} value={v} selected={rating === v} onChange={onChange} />
        ))}
      </div>
    </div>
  )
}

function CompetencySection({ section, ratings, onRate }) {
  const answered = section.behaviours.filter((b) => ratings[b.id] !== undefined).length
  const allDone = answered === section.behaviours.length

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#1a1f2e]">{section.title}</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">{answered} of {section.behaviours.length} answered</p>
        </div>
        {allDone && (
          <div className="flex items-center gap-1 text-green-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs font-medium">Complete</span>
          </div>
        )}
      </div>
      <div className="px-5 divide-y divide-[#f1f4f9]">
        {section.behaviours.map((b, i) => (
          <BehaviourRow
            key={b.id}
            behaviour={b}
            rating={ratings[b.id]}
            onChange={(val) => onRate(b.id, val)}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}

export default function FeedbackForm() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()

  const task = user.respondentTasks.find((t) => t.id === taskId)

  const [ratings, setRatings] = useState({})
  const [ssc, setSsc] = useState({ start: '', stop: '', continue: '' })
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved
  const [submitted, setSubmitted] = useState(task?.status === 'submitted')

  const answeredCount = Object.keys(ratings).length
  const progressPct = Math.round((answeredCount / TOTAL_BEHAVIOURS) * 100)
  const allRated = answeredCount === TOTAL_BEHAVIOURS

  const handleRate = useCallback((behaviourId, value) => {
    setRatings((prev) => ({ ...prev, [behaviourId]: value }))
    setSaveStatus('saving')
    setTimeout(() => setSaveStatus('saved'), 600)
  }, [])

  function handleSaveDraft() {
    setSaveStatus('saving')
    setTimeout(() => setSaveStatus('saved'), 800)
  }

  function handleSubmit() {
    if (!allRated) return
    setSubmitted(true)
  }

  if (!task) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Feedback task not found.</p>
        <button onClick={() => navigate('/respondent/dashboard')} className="mt-4 text-sm text-[#1e4d8c] hover:underline">
          ← Back to dashboard
        </button>
      </div>
    )
  }

  if (submitted) {
    return <SubmissionConfirmation task={task} onBack={() => navigate('/respondent/dashboard')} />
  }

  return (
    <div className="pb-32">
      {/* Sticky header with progress */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#e2e8f0] px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/respondent/dashboard')}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-[#1a1f2e] truncate">
                Feedback for <span className="text-[#1e4d8c]">{task.participantName}</span>
                <span className="text-gray-400 ml-1.5 font-normal">· {task.relationship}</span>
              </p>
              <span className="text-xs text-gray-400 shrink-0 ml-2">{answeredCount}/{TOTAL_BEHAVIOURS}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-[#1e4d8c] rounded-full h-1.5 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          {saveStatus === 'saving' && <span className="text-[10px] text-gray-400 shrink-0">Saving…</span>}
          {saveStatus === 'saved' && (
            <span className="text-[10px] text-green-600 shrink-0 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-6 space-y-6">
        {/* Welcome card */}
        <div className="bg-[#f0f6ff] border border-[#bfdbfe] rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e4d8c] flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {task.participantInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1a1f2e]">Feedback for {task.participantName}</p>
              <p className="text-xs text-gray-500">{task.designation} · {task.bu}</p>
              <p className="text-xs text-[#1e4d8c] mt-2 leading-relaxed">
                You have been nominated to provide 360 feedback as a <span className="font-medium">{task.relationship}</span>. Your responses are confidential and will be aggregated with feedback from others before being shared. Please answer honestly based on what you have directly observed.
              </p>
            </div>
          </div>
        </div>

        {/* Rating scale legend */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-4">
          <p className="text-xs font-semibold text-[#1a1f2e] mb-3">Rating Scale</p>
          <div className="flex items-center gap-4 flex-wrap">
            {Object.entries(RATING_LABELS).map(([val, label]) => (
              <div key={val} className="flex items-center gap-1.5">
                <div className="w-7 h-6 rounded-md bg-[#1e4d8c] text-white text-[10px] font-semibold flex items-center justify-center">
                  {val}
                </div>
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Competency sections */}
        {COMPETENCY_SECTIONS.map((section) => (
          <CompetencySection
            key={section.id}
            section={section}
            ratings={ratings}
            onRate={handleRate}
          />
        ))}

        {/* Start / Stop / Continue */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e2e8f0]">
            <h3 className="text-sm font-semibold text-[#1a1f2e]">Overall Feedback</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Open-ended — share what you genuinely observe. All three fields are optional.</p>
          </div>
          <div className="px-5 py-5 space-y-5">
            {[
              { key: 'start', label: 'Start', prompt: `What should ${task.participantName} start doing?`, colour: 'text-green-600' },
              { key: 'stop', label: 'Stop', prompt: `What should ${task.participantName} stop doing?`, colour: 'text-red-500' },
              { key: 'continue', label: 'Continue', prompt: `What should ${task.participantName} continue doing?`, colour: 'text-blue-600' },
            ].map(({ key, label, prompt, colour }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1.5">
                  <span className={colour}>{label}:</span>
                  <span className="text-gray-500 font-normal ml-1.5">{prompt}</span>
                </label>
                <textarea
                  rows={3}
                  value={ssc[key]}
                  onChange={(e) => setSsc((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder="Type your response here…"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2e8f0] text-sm text-[#1a1f2e] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e4d8c] focus:border-transparent resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-60 right-0 bg-white border-t border-[#e2e8f0] px-6 py-3 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            {allRated
              ? 'All questions answered — ready to submit.'
              : `${TOTAL_BEHAVIOURS - answeredCount} question${TOTAL_BEHAVIOURS - answeredCount > 1 ? 's' : ''} remaining before you can submit.`}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 text-sm font-medium text-[#1a1f2e] border border-[#e2e8f0] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={handleSubmit}
              disabled={!allRated}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
                allRated
                  ? 'bg-[#1e4d8c] text-white hover:bg-[#183f73]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Final
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmissionConfirmation({ task, onBack }) {
  return (
    <div className="p-8 max-w-lg mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-[#1a1f2e] mb-2">Feedback Submitted</h2>
      <p className="text-sm text-gray-500 mb-1">
        Your feedback for <span className="font-medium text-[#1a1f2e]">{task.participantName}</span> has been recorded.
      </p>
      <p className="text-xs text-gray-400 mb-8">
        Responses are confidential and will be aggregated before appearing in the 360 report.
      </p>
      <button
        onClick={onBack}
        className="px-5 py-2.5 bg-[#1e4d8c] text-white text-sm font-medium rounded-lg hover:bg-[#183f73] transition-colors"
      >
        Back to My Tasks
      </button>
    </div>
  )
}
