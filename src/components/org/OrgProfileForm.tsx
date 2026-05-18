'use client'

import { useMemo, useState } from 'react'
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Target,
} from 'lucide-react'
import type { ActivityArea, Demographic, OrgProfileFormData, ProfileSection } from '@/types/org'
import {
  ACTIVITY_AREAS,
  COUNTIES,
  DEFAULT_FORM_DATA,
  DEMOGRAPHICS,
  FUNDING_CATEGORIES,
  GRANT_WRITING_CAPACITY,
  ORG_TYPES,
  PROFILE_SECTIONS,
  SECTION_ORDER,
} from '@/lib/constants'

type FieldErrors = Partial<Record<keyof OrgProfileFormData, string>>

const SECTION_ICONS = {
  basics: Building2,
  community: Target,
  funding: FileText,
  review: CheckCircle2,
}

const REQUIRED_BY_SECTION: Record<ProfileSection, (keyof OrgProfileFormData)[]> = {
  basics: ['name', 'town', 'county', 'orgType'],
  community: ['description', 'activityAreas', 'targetDemographics'],
  funding: [
    'projectFundingNeed',
    'estimatedFundingAmount',
    'fundingCategory',
    'grantWritingCapacity',
    'biggestGrantChallenge',
  ],
  review: [],
}

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-stone-800">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs leading-5 text-stone-500">{children}</p>
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1 text-sm text-red-600">
      {message}
    </p>
  )
}

function StepHeader({ activeSection }: { activeSection: ProfileSection }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-4" aria-label="Organisation profile steps">
      {PROFILE_SECTIONS.map((section, index) => {
        const Icon = SECTION_ICONS[section.id]
        const activeIndex = SECTION_ORDER.indexOf(activeSection)
        const currentIndex = SECTION_ORDER.indexOf(section.id)
        const isActive = section.id === activeSection
        const isComplete = currentIndex < activeIndex

        return (
          <li
            key={section.id}
            className={`rounded-lg border px-3 py-3 ${
              isActive
                ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                : isComplete
                  ? 'border-emerald-200 bg-white text-stone-700'
                  : 'border-stone-200 bg-white text-stone-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${isActive || isComplete ? 'text-emerald-600' : 'text-stone-400'}`} />
              <span className="text-xs font-semibold uppercase tracking-wide">Step {index + 1}</span>
            </div>
            <p className="mt-1 text-sm font-semibold">{section.label}</p>
          </li>
        )
      })}
    </ol>
  )
}

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
      className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
        selected
          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50'
      }`}
      aria-pressed={selected}
    >
      {label}
    </button>
  )
}

function SummaryItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-stone-100 py-3 last:border-b-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-stone-900">{value || 'Not provided'}</dd>
    </div>
  )
}

function asEuroAmount(value: string) {
  const numeric = value.replace(/[^\d]/g, '')
  if (!numeric) return value
  return `€${Number(numeric).toLocaleString('en-IE')}`
}

function fieldIsEmpty(data: OrgProfileFormData, field: keyof OrgProfileFormData) {
  const value = data[field]
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'string') return value.trim().length === 0
  return value === undefined || value === null
}

function validateSections(data: OrgProfileFormData, sections: ProfileSection[]) {
  const errors: FieldErrors = {}

  sections.flatMap((section) => REQUIRED_BY_SECTION[section]).forEach((field) => {
    if (fieldIsEmpty(data, field)) {
      errors[field] = 'Please fill this in before continuing.'
    }
  })

  if (data.estimatedFundingAmount.trim()) {
    const amount = Number(data.estimatedFundingAmount.replace(/[^\d.]/g, ''))
    if (!Number.isFinite(amount) || amount <= 0) {
      errors.estimatedFundingAmount = 'Enter an approximate amount, for example 5000.'
    }
  }

  return errors
}

function deriveBudgetRange(amountValue: string): OrgProfileFormData['budgetRange'] {
  const amount = Number(amountValue.replace(/[^\d.]/g, ''))
  if (!Number.isFinite(amount)) return '10k-50k'
  if (amount < 10000) return 'under-10k'
  if (amount < 50000) return '10k-50k'
  if (amount < 100000) return '50k-100k'
  if (amount < 250000) return '100k-250k'
  if (amount < 500000) return '250k-500k'
  if (amount < 1000000) return '500k-1m'
  return 'over-1m'
}

function BasicsStep({
  data,
  errors,
  onChange,
}: {
  data: OrgProfileFormData
  errors: FieldErrors
  onChange: (patch: Partial<OrgProfileFormData>) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="name" required>Organisation name</Label>
        <input
          id="name"
          className="form-input"
          value={data.name}
          onChange={(event) => onChange({ name: event.target.value })}
          aria-describedby="name-error"
          placeholder="e.g. Ballymore Community Centre"
        />
        <ErrorText id="name-error" message={errors.name} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="county" required>County</Label>
          <select
            id="county"
            className="form-input"
            value={data.county}
            onChange={(event) => onChange({ county: event.target.value as OrgProfileFormData['county'] })}
          >
            {(Object.entries(COUNTIES) as [OrgProfileFormData['county'], string][]).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="town" required>Local area or town</Label>
          <input
            id="town"
            className="form-input"
            value={data.town}
            onChange={(event) => onChange({ town: event.target.value, addressLine1: event.target.value })}
            aria-describedby="town-error"
            placeholder="e.g. Ballymore, Westport"
          />
          <ErrorText id="town-error" message={errors.town} />
        </div>
      </div>

      <div>
        <Label htmlFor="orgType" required>Organisation type</Label>
        <select
          id="orgType"
          className="form-input"
          value={data.orgType}
          onChange={(event) => onChange({ orgType: event.target.value as OrgProfileFormData['orgType'] })}
        >
          {(Object.entries(ORG_TYPES) as [OrgProfileFormData['orgType'], string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <Hint>Choose the closest fit. It is fine to choose Other if you are unsure.</Hint>
      </div>
    </div>
  )
}

function CommunityStep({
  data,
  errors,
  onChange,
}: {
  data: OrgProfileFormData
  errors: FieldErrors
  onChange: (patch: Partial<OrgProfileFormData>) => void
}) {
  function setMainActivity(area: ActivityArea) {
    onChange({ activityAreas: [area] })
  }

  function toggleDemographic(demographic: Demographic) {
    const next = data.targetDemographics.includes(demographic)
      ? data.targetDemographics.filter((item) => item !== demographic)
      : [...data.targetDemographics, demographic]
    onChange({ targetDemographics: next })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="activityAreas" required>Main activity area</Label>
        <div id="activityAreas" className="flex flex-wrap gap-2">
          {(Object.entries(ACTIVITY_AREAS) as [ActivityArea, string][]).map(([value, label]) => (
            <TagToggle
              key={value}
              label={label}
              selected={data.activityAreas[0] === value}
              onToggle={() => setMainActivity(value)}
            />
          ))}
        </div>
        <ErrorText id="activityAreas-error" message={errors.activityAreas} />
      </div>

      <div>
        <Label htmlFor="description" required>Short organisation description</Label>
        <textarea
          id="description"
          className="form-input"
          rows={4}
          value={data.description}
          onChange={(event) => onChange({ description: event.target.value, mission: event.target.value })}
          aria-describedby="description-hint description-error"
          placeholder="Tell us what your organisation does in a few sentences."
        />
        <Hint>
          <span id="description-hint">This will later help GrantCraft draft organisation background answers.</span>
        </Hint>
        <ErrorText id="description-error" message={errors.description} />
      </div>

      <div>
        <Label htmlFor="targetDemographics" required>Beneficiaries or audience served</Label>
        <div id="targetDemographics" className="flex flex-wrap gap-2">
          {(Object.entries(DEMOGRAPHICS) as [Demographic, string][]).map(([value, label]) => (
            <TagToggle
              key={value}
              label={label}
              selected={data.targetDemographics.includes(value)}
              onToggle={() => toggleDemographic(value)}
            />
          ))}
        </div>
        <Hint>Select the groups you most often support.</Hint>
        <ErrorText id="targetDemographics-error" message={errors.targetDemographics} />
      </div>
    </div>
  )
}

function FundingStep({
  data,
  errors,
  onChange,
}: {
  data: OrgProfileFormData
  errors: FieldErrors
  onChange: (patch: Partial<OrgProfileFormData>) => void
}) {
  function updateEstimatedAmount(value: string) {
    onChange({
      estimatedFundingAmount: value,
      budgetRange: deriveBudgetRange(value),
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="projectFundingNeed" required>Project or funding need</Label>
        <textarea
          id="projectFundingNeed"
          className="form-input"
          rows={4}
          value={data.projectFundingNeed}
          onChange={(event) => onChange({ projectFundingNeed: event.target.value })}
          aria-describedby="projectFundingNeed-error"
          placeholder="What do you need funding for right now?"
        />
        <ErrorText id="projectFundingNeed-error" message={errors.projectFundingNeed} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="estimatedFundingAmount" required>Estimated funding amount</Label>
          <input
            id="estimatedFundingAmount"
            className="form-input"
            inputMode="numeric"
            value={data.estimatedFundingAmount}
            onChange={(event) => updateEstimatedAmount(event.target.value)}
            aria-describedby="estimatedFundingAmount-hint estimatedFundingAmount-error"
            placeholder="e.g. 15000"
          />
          <Hint>
            <span id="estimatedFundingAmount-hint">An estimate is enough for beta testing.</span>
          </Hint>
          <ErrorText id="estimatedFundingAmount-error" message={errors.estimatedFundingAmount} />
        </div>

        <div>
          <Label htmlFor="fundingCategory" required>Funding category</Label>
          <select
            id="fundingCategory"
            className="form-input"
            value={data.fundingCategory}
            onChange={(event) => onChange({ fundingCategory: event.target.value as OrgProfileFormData['fundingCategory'] })}
          >
            {(Object.entries(FUNDING_CATEGORIES) as [OrgProfileFormData['fundingCategory'], string][]).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-stone-800">Previous grant experience</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {(Object.entries(GRANT_WRITING_CAPACITY) as [OrgProfileFormData['grantWritingCapacity'], string][]).map(([value, label]) => (
            <label
              key={value}
              className={`cursor-pointer rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                data.grantWritingCapacity === value
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
              }`}
            >
              <input
                type="radio"
                name="grantWritingCapacity"
                value={value}
                checked={data.grantWritingCapacity === value}
                onChange={() => onChange({
                  grantWritingCapacity: value,
                  hasGrantExperience: value !== 'none',
                })}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <Label htmlFor="biggestGrantChallenge" required>Biggest challenge with grants</Label>
        <textarea
          id="biggestGrantChallenge"
          className="form-input"
          rows={3}
          value={data.biggestGrantChallenge}
          onChange={(event) => onChange({ biggestGrantChallenge: event.target.value })}
          aria-describedby="biggestGrantChallenge-error"
          placeholder="e.g. finding suitable grants, knowing what to write, time to complete forms"
        />
        <ErrorText id="biggestGrantChallenge-error" message={errors.biggestGrantChallenge} />
      </div>
    </div>
  )
}

function ReviewStep({ data }: { data: OrgProfileFormData }) {
  const mainActivity = data.activityAreas[0] ? ACTIVITY_AREAS[data.activityAreas[0]] : ''
  const audience = data.targetDemographics.map((item) => DEMOGRAPHICS[item]).join(', ')

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-950">
        Check these details before saving. You can come back and update the profile later.
      </div>

      <dl className="rounded-lg border border-stone-200 bg-white px-4">
        <SummaryItem label="Organisation name" value={data.name} />
        <SummaryItem label="County" value={COUNTIES[data.county]} />
        <SummaryItem label="Local area or town" value={data.town} />
        <SummaryItem label="Organisation type" value={ORG_TYPES[data.orgType]} />
        <SummaryItem label="Main activity area" value={mainActivity} />
        <SummaryItem label="Organisation description" value={data.description} />
        <SummaryItem label="Beneficiaries or audience" value={audience} />
        <SummaryItem label="Project or funding need" value={data.projectFundingNeed} />
        <SummaryItem label="Estimated funding amount" value={asEuroAmount(data.estimatedFundingAmount)} />
        <SummaryItem label="Funding category" value={FUNDING_CATEGORIES[data.fundingCategory]} />
        <SummaryItem label="Previous grant experience" value={GRANT_WRITING_CAPACITY[data.grantWritingCapacity]} />
        <SummaryItem label="Biggest grant challenge" value={data.biggestGrantChallenge} />
      </dl>
    </div>
  )
}

interface OrgProfileFormProps {
  initialData?: Partial<OrgProfileFormData>
  onSave?: (data: OrgProfileFormData) => Promise<void>
}

export default function OrgProfileForm({ initialData, onSave }: OrgProfileFormProps) {
  const [formData, setFormData] = useState<OrgProfileFormData>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  })
  const [activeSection, setActiveSection] = useState<ProfileSection>('basics')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const currentIndex = SECTION_ORDER.indexOf(activeSection)
  const isFirst = currentIndex === 0
  const isReview = activeSection === 'review'
  const activeMeta = PROFILE_SECTIONS.find((section) => section.id === activeSection)!

  const completedStepCount = useMemo(() => {
    return SECTION_ORDER.filter((section) => {
      if (section === 'review') return false
      return Object.keys(validateSections(formData, [section])).length === 0
    }).length
  }, [formData])

  function patch(update: Partial<OrgProfileFormData>) {
    setFormData((previous) => ({ ...previous, ...update }))
    setErrors((previous) => {
      const next = { ...previous }
      Object.keys(update).forEach((field) => delete next[field as keyof OrgProfileFormData])
      return next
    })
    setSaveError('')
  }

  function goBack() {
    if (!isFirst) setActiveSection(SECTION_ORDER[currentIndex - 1])
  }

  function goNext() {
    const sectionErrors = validateSections(formData, [activeSection])
    setErrors(sectionErrors)
    if (Object.keys(sectionErrors).length > 0) return
    setActiveSection(SECTION_ORDER[currentIndex + 1])
  }

  async function handleSave() {
    const allErrors = validateSections(formData, ['basics', 'community', 'funding'])
    setErrors(allErrors)
    if (Object.keys(allErrors).length > 0) {
      const firstSectionWithError = SECTION_ORDER.find((section) =>
        REQUIRED_BY_SECTION[section].some((field) => allErrors[field])
      )
      if (firstSectionWithError) setActiveSection(firstSectionWithError)
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      await (onSave?.(formData) ?? Promise.resolve())
    } catch {
      setSaveError('We could not save the profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const sectionContent: Record<ProfileSection, React.ReactNode> = {
    basics: <BasicsStep data={formData} errors={errors} onChange={patch} />,
    community: <CommunityStep data={formData} errors={errors} onChange={patch} />,
    funding: <FundingStep data={formData} errors={errors} onChange={patch} />,
    review: <ReviewStep data={formData} />,
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <p className="text-sm font-semibold text-emerald-700">GrantCraft beta</p>
          <h1 className="mt-2 text-2xl font-semibold text-stone-950">Organisation profile</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Add the essentials GrantCraft needs to recommend relevant grants and support future application drafts.
          </p>
        </div>

        <StepHeader activeSection={activeSection} />

        <section className="mt-6 rounded-lg border border-stone-200 bg-white">
          <div className="border-b border-stone-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-stone-950">{activeMeta.label}</h2>
                <p className="mt-1 text-sm text-stone-500">{activeMeta.description}</p>
              </div>
              <p className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                {completedStepCount} of 3 sections ready
              </p>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-6">
            {sectionContent[activeSection]}
            {saveError && (
              <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {saveError}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-stone-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <button
              type="button"
              onClick={goBack}
              disabled={isFirst || saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            {isReview ? (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving profile...' : 'Save profile'}
                {!saving && <CheckCircle2 className="h-4 w-4" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
