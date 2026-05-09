export interface ProjectBrief {
  projectTitle: string
  needStatement: string
  proposedActivities: string
  targetBeneficiaries: string
  expectedOutcomes: string
  estimatedBudgetRange: string
  sustainabilityPlan: string
}

export type IdeaStatus = 'draft' | 'saved'

export interface ProjectIdea {
  id: string
  orgId: string
  userId: string
  rawIdea: string
  brief: ProjectBrief | null
  status: IdeaStatus
  createdAt: string
  updatedAt: string
}

export type SaveIdeaData = {
  orgId: string
  rawIdea: string
  brief: ProjectBrief
}
