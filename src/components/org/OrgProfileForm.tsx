'use client'

import { useState } from 'react'
import {
  Building2,
  MapPin,
  Mail,
  Users,
  Target,
  FileText,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import type { OrgProfileFormData, ProfileSection, ActivityArea, Demographic } from '@/types/org'
import {
  ORG_TYPES,
  COUNTIES,
  ACTIVITY_AREAS,
  DEMOGRAPHICS,
  BUDGET_RANGES,
  GEO_REACH_LABELS,
  ORG_SETTINGS,
  GRANT_WRITING_CAPACITY,
  PROFILE_SECTIONS,
  SECTION_ORDER,
  DEFAULT_FORM_DATA,
} from '@/lib/constants'

const SECTION_ICONS = {
  identity: Building2,
  location: MapPin,
  contact: Mail,
  capacity: Users,
  activities: Target,
  'grant-experience': FileText,
}

const REQUIRED_FIELDS: (keyof OrgProfileFormData)[] = [
  'name',
  'description',
  'mission',
  'addressLine1',
  'town',
  'contactName',
  'contactRole',
  'contactEmail',
]

function calculateCompleteness(data: OrgProfileFormData): number {
  const textFilled = REQUIRED_FIELDS.filter((f) => {
    const v = data[f]
    return typeof v === 'string' ? v.trim().length > 0 : Boolean(v)
  }).length
  const hasActivities = data.activityAreas.length > 0 ? 1 : 0
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail) ? 1 : 0
  const total = REQUIRED_FIELDS.length + 2
  return Math.round(((textFilled - (data.contactEmail.trim() ? 1 : 0) + emailValid + hasActivities) / total) * 100)
}

// --- Completeness ring ---

const RING_R = 26
const RING_C = 2 * Math.PI * RING_R

function CompletenessRing({ pct }: { pct: number }) {
  const offset = RING_C * (1 - pct / 100)
  return (
    <div className="relative flex items-center justify-center">
      <svg width="72" height="72" className="-rotate-90" aria-hidden>
        <circle cx="36" cy="36" r={RING_R} fill="none" stroke="#e7e5e4" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={RING_R}
          fill="none"
          stroke="#10b981"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-sm font-semibold text-stone-800">{pct}%</span>
    </div>
  )
}

// --- Tag toggle ---

function TagToggle({
  label,
  selected,
  onToggle,
}: {
  label: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        selected
          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'
      }`}
    >
      {label}
    </button>
  )
}

// --- Field helpers ---

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-stone-700">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  )
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-stone-500">{children}</p>
}

function RadioGroup<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string
  options: Record<T, string>
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {(Object.entries(options) as [T, string][]).map(([k, label]) => (
        <label
          key={k}
          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
            value === k
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={k}
            checked={value === k}
            onChange={() => onChange(k)}
            className="sr-only"
          />
          {label}
        </label>
      ))}
    </div>
  )
}

// --- Section components ---

function IdentitySection({
  data,
  onChange,
}: {
  data: OrgProfileFormData
  onChange: (patch: Partial<OrgProfileFormData>) => void
}) {
  return (
    <FieldGroup>
      <div>
        <Label htmlFor="name" required>Organisation name</Label>
        <input
          id="name"
          className="form-input"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. Tidy Towns Ballymoore CLG"
        />
      </div>

      <div>
        <Label htmlFor="legalName">Legal name (if different)</Label>
        <input
          id="legalName"
          className="form-input"
          value={data.legalName ?? ''}
          onChange={(e) => onChange({ legalName: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="orgType" required>Organisation type</Label>
        <select
          id="orgType"
          className="form-input"
          value={data.orgType}
          onChange={(e) => onChange({ orgType: e.target.value as OrgProfileFormData['orgType'] })}
        >
          {(Object.entries(ORG_TYPES) as [OrgProfileFormData['orgType'], string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="charityNumber">Charity number</Label>
          <input
            id="charityNumber"
            className="form-input"
            value={data.charityNumber ?? ''}
            onChange={(e) => onChange({ charityNumber: e.target.value })}
            placeholder="20XXXXXX"
          />
        </div>
        <div>
          <Label htmlFor="companyNumber">CRO number</Label>
          <input
            id="companyNumber"
            className="form-input"
            value={data.companyNumber ?? ''}
            onChange={(e) => onChange({ companyNumber: e.target.value })}
            placeholder="XXXXXXXX"
          />
        </div>
        <div>
          <Label htmlFor="taxExemptionRef">Tax exemption ref</Label>
          <input
            id="taxExemptionRef"
            className="form-input"
            value={data.taxExemptionRef ?? ''}
            onChange={(e) => onChange({ taxExemptionRef: e.target.value })}
            placeholder="CHY XXXXX"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="yearFounded" required>Year founded</Label>
        <input
          id="yearFounded"
          type="number"
          className="form-input w-32"
          min={1800}
          max={new Date().getFullYear()}
          value={data.yearFounded}
          onChange={(e) => onChange({ yearFounded: Number(e.target.value) })}
        />
      </div>

      <div>
        <Label htmlFor="description" required>Organisation description</Label>
        <textarea
          id="description"
          rows={3}
          className="form-input"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Briefly describe what your organisation does and who it serves."
        />
        <Hint>{data.description.length} / 500 characters</Hint>
      </div>

      <div>
        <Label htmlFor="mission" required>Mission statement</Label>
        <textarea
          id="mission"
          rows={2}
          className="form-input"
          value={data.mission}
          onChange={(e) => onChange({ mission: e.target.value })}
          placeholder="Our mission is to…"
        />
      </div>
    </FieldGroup>
  )
}

function LocationSection({
  data,
  onChange,
}: {
  data: OrgProfileFormData
  onChange: (patch: Partial<OrgProfileFormData>) => void
}) {
  return (
    <FieldGroup>
      <div>
        <Label htmlFor="addressLine1" required>Address line 1</Label>
        <input
          id="addressLine1"
          className="form-input"
          value={data.addressLine1}
          onChange={(e) => onChange({ addressLine1: e.target.value })}
          placeholder="Street address or PO Box"
        />
      </div>

      <div>
        <Label htmlFor="addressLine2">Address line 2</Label>
        <input
          id="addressLine2"
          className="form-input"
          value={data.addressLine2 ?? ''}
          onChange={(e) => onChange({ addressLine2: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Label htmlFor="town" required>Town / City</Label>
          <input
            id="town"
            className="form-input"
            value={data.town}
            onChange={(e) => onChange({ town: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="eircode">Eircode</Label>
          <input
            id="eircode"
            className="form-input"
            value={data.eircode ?? ''}
            onChange={(e) => onChange({ eircode: e.target.value.toUpperCase() })}
            placeholder="X00 XX00"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="county" required>County</Label>
        <select
          id="county"
          className="form-input"
          value={data.county}
          onChange={(e) => onChange({ county: e.target.value as OrgProfileFormData['county'] })}
        >
          {(Object.entries(COUNTIES) as [OrgProfileFormData['county'], string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="setting">Area setting</Label>
        <RadioGroup
          name="setting"
          options={ORG_SETTINGS}
          value={data.setting}
          onChange={(v) => onChange({ setting: v })}
        />
      </div>
    </FieldGroup>
  )
}

function ContactSection({
  data,
  onChange,
}: {
  data: OrgProfileFormData
  onChange: (patch: Partial<OrgProfileFormData>) => void
}) {
  return (
    <FieldGroup>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contactName" required>Contact name</Label>
          <input
            id="contactName"
            className="form-input"
            value={data.contactName}
            onChange={(e) => onChange({ contactName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="contactRole" required>Job title / role</Label>
          <input
            id="contactRole"
            className="form-input"
            value={data.contactRole}
            onChange={(e) => onChange({ contactRole: e.target.value })}
            placeholder="e.g. Chairperson, Coordinator"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contactEmail" required>Email address</Label>
        <input
          id="contactEmail"
          type="email"
          className="form-input"
          value={data.contactEmail}
          onChange={(e) => onChange({ contactEmail: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="contactPhone">Phone number</Label>
        <input
          id="contactPhone"
          type="tel"
          className="form-input"
          value={data.contactPhone ?? ''}
          onChange={(e) => onChange({ contactPhone: e.target.value })}
          placeholder="+353 1 XXX XXXX"
        />
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <input
          id="website"
          type="url"
          className="form-input"
          value={data.website ?? ''}
          onChange={(e) => onChange({ website: e.target.value })}
          placeholder="https://www.example.ie"
        />
      </div>
    </FieldGroup>
  )
}

function CapacitySection({
  data,
  onChange,
}: {
  data: OrgProfileFormData
  onChange: (patch: Partial<OrgProfileFormData>) => void
}) {
  return (
    <FieldGroup>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="staffCount">Paid staff (full-time equivalent)</Label>
          <input
            id="staffCount"
            type="number"
            min={0}
            className="form-input"
            value={data.staffCount}
            onChange={(e) => onChange({ staffCount: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="volunteerCount">Active volunteers</Label>
          <input
            id="volunteerCount"
            type="number"
            min={0}
            className="form-input"
            value={data.volunteerCount}
            onChange={(e) => onChange({ volunteerCount: Number(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="budgetRange" required>Annual turnover / budget</Label>
        <select
          id="budgetRange"
          className="form-input"
          value={data.budgetRange}
          onChange={(e) => onChange({ budgetRange: e.target.value as OrgProfileFormData['budgetRange'] })}
        >
          {(Object.entries(BUDGET_RANGES) as [OrgProfileFormData['budgetRange'], string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <Hint>This helps match you with appropriately sized grant programmes.</Hint>
      </div>
    </FieldGroup>
  )
}

function ActivitiesSection({
  data,
  onChange,
}: {
  data: OrgProfileFormData
  onChange: (patch: Partial<OrgProfileFormData>) => void
}) {
  function toggleActivity(area: ActivityArea) {
    const next = data.activityAreas.includes(area)
      ? data.activityAreas.filter((a) => a !== area)
      : [...data.activityAreas, area]
    onChange({ activityAreas: next })
  }

  function toggleDemographic(d: Demographic) {
    const next = data.targetDemographics.includes(d)
      ? data.targetDemographics.filter((x) => x !== d)
      : [...data.targetDemographics, d]
    onChange({ targetDemographics: next })
  }

  return (
    <FieldGroup>
      <div>
        <Label htmlFor="geographicReach">Geographic reach</Label>
        <RadioGroup
          name="geographicReach"
          options={GEO_REACH_LABELS}
          value={data.geographicReach}
          onChange={(v) => onChange({ geographicReach: v })}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-stone-700">
          Activity areas <span className="ml-1 text-red-500">*</span>
        </p>
        <p className="mb-3 text-xs text-stone-500">Select all that apply. These determine which grants you will be matched to.</p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(ACTIVITY_AREAS) as [ActivityArea, string][]).map(([k, v]) => (
            <TagToggle
              key={k}
              label={v}
              selected={data.activityAreas.includes(k)}
              onToggle={() => toggleActivity(k)}
            />
          ))}
        </div>
        {data.activityAreas.length > 0 && (
          <p className="mt-2 text-xs text-emerald-600">{data.activityAreas.length} selected</p>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-stone-700">Target demographics</p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(DEMOGRAPHICS) as [Demographic, string][]).map(([k, v]) => (
            <TagToggle
              key={k}
              label={v}
              selected={data.targetDemographics.includes(k)}
              onToggle={() => toggleDemographic(k)}
            />
          ))}
        </div>
        {data.targetDemographics.length > 0 && (
          <p className="mt-2 text-xs text-emerald-600">{data.targetDemographics.length} selected</p>
        )}
      </div>
    </FieldGroup>
  )
}

function GrantExperienceSection({
  data,
  onChange,
}: {
  data: OrgProfileFormData
  onChange: (patch: Partial<OrgProfileFormData>) => void
}) {
  return (
    <FieldGroup>
      <div>
        <p className="mb-2 text-sm font-medium text-stone-700">Has your organisation received grant funding before?</p>
        <div className="flex gap-3">
          {(['yes', 'no'] as const).map((v) => {
            const active = (v === 'yes') === data.hasGrantExperience
            return (
              <button
                key={v}
                type="button"
                onClick={() => onChange({ hasGrantExperience: v === 'yes' })}
                className={`rounded-lg border px-5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                {v === 'yes' ? 'Yes' : 'No'}
              </button>
            )
          })}
        </div>
      </div>

      {data.hasGrantExperience && (
        <>
          <div>
            <Label htmlFor="previousGrantsDetail">Tell us about previous grants received</Label>
            <textarea
              id="previousGrantsDetail"
              rows={4}
              className="form-input"
              value={data.previousGrantsDetail ?? ''}
              onChange={(e) => onChange({ previousGrantsDetail: e.target.value })}
              placeholder="Include funder names, programme titles, and approximate amounts if known."
            />
          </div>

          <div>
            <Label htmlFor="largestGrantReceived">Largest single grant received</Label>
            <input
              id="largestGrantReceived"
              className="form-input"
              value={data.largestGrantReceived ?? ''}
              onChange={(e) => onChange({ largestGrantReceived: e.target.value })}
              placeholder="e.g. €25,000 from the Community Foundation"
            />
          </div>
        </>
      )}

      <div>
        <Label htmlFor="grantWritingCapacity">Grant writing experience</Label>
        <RadioGroup
          name="grantWritingCapacity"
          options={GRANT_WRITING_CAPACITY}
          value={data.grantWritingCapacity}
          onChange={(v) => onChange({ grantWritingCapacity: v })}
        />
        <Hint>This helps us suggest the right level of support for your applications.</Hint>
      </div>
    </FieldGroup>
  )
}

// --- Main form ---

interface OrgProfileFormProps {
  initialData?: Partial<OrgProfileFormData>
  onSave?: (data: OrgProfileFormData) => Promise<void>
}

export default function OrgProfileForm({ initialData, onSave }: OrgProfileFormProps) {
  const [formData, setFormData] = useState<OrgProfileFormData>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  })
  const [activeSection, setActiveSection] = useState<ProfileSection>('identity')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const completeness = calculateCompleteness(formData)
  const currentIndex = SECTION_ORDER.indexOf(activeSection)
  const isLast = currentIndex === SECTION_ORDER.length - 1

  function patch(update: Partial<OrgProfileFormData>) {
    setFormData((prev) => ({ ...prev, ...update }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await (onSave?.(formData) ?? Promise.resolve())
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  function goNext() {
    if (!isLast) setActiveSection(SECTION_ORDER[currentIndex + 1])
  }

  const sectionContent: Record<ProfileSection, React.ReactNode> = {
    identity: <IdentitySection data={formData} onChange={patch} />,
    location: <LocationSection data={formData} onChange={patch} />,
    contact: <ContactSection data={formData} onChange={patch} />,
    capacity: <CapacitySection data={formData} onChange={patch} />,
    activities: <ActivitiesSection data={formData} onChange={patch} />,
    'grant-experience': <GrantExperienceSection data={formData} onChange={patch} />,
  }

  const activeMeta = PROFILE_SECTIONS.find((s) => s.id === activeSection)!

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-stone-200 bg-white lg:flex lg:flex-col">
        <div className="flex flex-col items-center gap-3 border-b border-stone-100 px-6 py-8">
          <CompletenessRing pct={completeness} />
          <div className="text-center">
            <p className="text-sm font-semibold text-stone-800">Profile completeness</p>
            <p className="text-xs text-stone-500">Complete all sections to unlock grant matching</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {PROFILE_SECTIONS.map((section) => {
              const Icon = SECTION_ICONS[section.id]
              const isActive = section.id === activeSection
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{section.label}</p>
                      <p className="truncate text-xs text-stone-400">{section.description}</p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col">
        {/* Section header */}
        <header className="border-b border-stone-200 bg-white px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = SECTION_ICONS[activeSection]
              return <Icon className="h-5 w-5 text-emerald-600" />
            })()}
            <div>
              <h1 className="text-lg font-semibold text-stone-900">{activeMeta.label}</h1>
              <p className="text-sm text-stone-500">{activeMeta.description}</p>
            </div>
          </div>

          {/* Mobile section nav */}
          <div className="mt-4 flex gap-1 overflow-x-auto lg:hidden">
            {PROFILE_SECTIONS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  s.id === activeSection
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                {i + 1}. {s.label}
              </button>
            ))}
          </div>
        </header>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8">
          <div className="mx-auto max-w-2xl">
            {sectionContent[activeSection]}
          </div>
        </div>

        {/* Footer actions */}
        <footer className="border-t border-stone-200 bg-white px-6 py-4 sm:px-8">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-50"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Saved
                </>
              ) : saving ? (
                'Saving…'
              ) : (
                'Save progress'
              )}
            </button>

            {!isLast && (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Next: {PROFILE_SECTIONS[currentIndex + 1].label}
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            {isLast && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                Save profile
              </button>
            )}
          </div>
        </footer>
      </main>
    </div>
  )
}
