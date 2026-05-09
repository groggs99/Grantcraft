'use client'

import { useState } from 'react'
import {
  Lightbulb,
  Sparkles,
  FileText,
  Save,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import type { ProjectBrief, SaveIdeaData } from '@/types/ideas'

const BRIEF_FIELDS: {
  key: keyof ProjectBrief
  label: string
  hint: string
  multiline: boolean
}[] = [
  {
    key: 'projectTitle',
    label: 'Project Title',
    hint: 'A clear, concise title for the project',
    multiline: false,
  },
  {
    key: 'needStatement',
    label: 'Need Statement',
    hint: 'The evidence-based problem or need your project addresses',
    multiline: true,
  },
  {
    key: 'proposedActivities',
    label: 'Proposed Activities',
    hint: 'The specific activities and interventions you plan to deliver',
    multiline: true,
  },
  {
    key: 'targetBeneficiaries',
    label: 'Target Beneficiaries',
    hint: 'Who will benefit, how many, and how they will be reached',
    multiline: true,
  },
  {
    key: 'expectedOutcomes',
    label: 'Expected Outcomes',
    hint: 'The measurable outcomes and impacts of the project',
    multiline: true,
  },
  {
    key: 'estimatedBudgetRange',
    label: 'Estimated Budget Range',
    hint: 'A realistic cost estimate with brief rationale',
    multiline: true,
  },
  {
    key: 'sustainabilityPlan',
    label: 'Sustainability Plan',
    hint: 'How the project will continue or impacts be maintained after funding ends',
    multiline: true,
  },
]

interface Props {
  orgId: string
  orgName: string
  onSave: (data: SaveIdeaData) => Promise<void>
}

export default function IdeaBriefForm({ orgId, orgName, onSave }: Props) {
  const [rawIdea, setRawIdea] = useState('')
  const [brief, setBrief] = useState<ProjectBrief | null>(null)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  async function handleGenerate() {
    if (!rawIdea.trim() || generating) return
    setGenerating(true)
    setGenerateError(null)
    setSaved(false)
    try {
      const res = await fetch('/api/ai/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId, rawIdea }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate brief')
      setBrief(data.brief as ProjectBrief)
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave() {
    if (!brief || saving) return
    setSaving(true)
    setSaveError(null)
    try {
      await onSave({ orgId, rawIdea, brief })
      setSaved(true)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save brief')
    } finally {
      setSaving(false)
    }
  }

  function updateBriefField(key: keyof ProjectBrief, value: string) {
    if (!brief) return
    setBrief({ ...brief, [key]: value })
    setSaved(false)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page header */}
      <div className="border-b border-stone-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-1.5 text-sm text-stone-400">
            <span>{orgName}</span>
            <span>›</span>
            <span className="text-stone-700">New Project Idea</span>
          </div>
          <h1 className="mt-1 text-xl font-semibold text-stone-900">
            Project Idea Development
          </h1>
          <p className="mt-0.5 text-sm text-stone-500">
            Describe your idea in plain language and we'll generate a structured grant brief using your organisation's profile.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">

        {/* Idea input */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-emerald-600" aria-hidden />
            <h2 className="font-semibold text-stone-900">Your Idea</h2>
          </div>

          <label htmlFor="raw-idea" className="mb-1.5 block text-sm font-medium text-stone-700">
            Describe your project idea
          </label>
          <textarea
            id="raw-idea"
            className="form-input min-h-[144px] resize-y"
            placeholder="Describe your project idea in a few sentences — what do you want to do, and why?"
            value={rawIdea}
            onChange={(e) => {
              setRawIdea(e.target.value)
              setSaved(false)
            }}
            disabled={generating}
          />

          {generateError && (
            <p className="mt-2 text-sm text-red-600" role="alert">{generateError}</p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating || !rawIdea.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Generating brief…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" aria-hidden />
                  {brief ? 'Regenerate Brief' : 'Generate Project Brief'}
                </>
              )}
            </button>
          </div>
        </section>

        {/* Generated brief — only shown after generation */}
        {brief && (
          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" aria-hidden />
                <h2 className="font-semibold text-stone-900">Project Brief</h2>
              </div>
              <span className="text-xs text-stone-400">You can edit any field before saving</span>
            </div>

            <div className="space-y-6">
              {BRIEF_FIELDS.map(({ key, label, hint, multiline }) => (
                <div key={key}>
                  <label
                    htmlFor={`brief-${key}`}
                    className="mb-1.5 block text-sm font-medium text-stone-700"
                  >
                    {label}
                  </label>
                  {multiline ? (
                    <textarea
                      id={`brief-${key}`}
                      className="form-input min-h-[88px] resize-y"
                      value={brief[key]}
                      onChange={(e) => updateBriefField(key, e.target.value)}
                    />
                  ) : (
                    <input
                      id={`brief-${key}`}
                      type="text"
                      className="form-input"
                      value={brief[key]}
                      onChange={(e) => updateBriefField(key, e.target.value)}
                    />
                  )}
                  <p className="mt-1 text-xs text-stone-400">{hint}</p>
                </div>
              ))}
            </div>

            {saveError && (
              <p className="mt-4 text-sm text-red-600" role="alert">{saveError}</p>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating || !rawIdea.trim()}
                className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Regenerating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" aria-hidden />
                    Regenerate
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || saved}
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  saved ? 'bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Saving…
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" aria-hidden />
                    Save Brief
                  </>
                )}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
