export type OrgType =
  | 'clg'
  | 'cic'
  | 'unincorporated'
  | 'charitable-trust'
  | 'cooperative'
  | 'registered-charity'
  | 'social-enterprise'
  | 'friendly-society'
  | 'other'

export type OrgSetting = 'urban' | 'suburban' | 'rural' | 'mixed'

export type BudgetRange =
  | 'under-10k'
  | '10k-50k'
  | '50k-100k'
  | '100k-250k'
  | '250k-500k'
  | '500k-1m'
  | 'over-1m'

export type GeographicReach = 'local' | 'county' | 'regional' | 'national' | 'international'

export type ActivityArea =
  | 'arts-culture'
  | 'sports-recreation'
  | 'community-development'
  | 'education-training'
  | 'health-wellbeing'
  | 'environment'
  | 'climate-action'
  | 'just-transition'
  | 'heritage-conservation'
  | 'coastal-marine'
  | 'dsgbv'
  | 'lgbtiq-plus'
  | 'disability'
  | 'mental-health'
  | 'children-young-people'
  | 'older-people'
  | 'housing-homelessness'
  | 'social-inclusion'
  | 'rural-development'
  | 'urban-regeneration'
  | 'volunteering'
  | 'international-development'
  | 'animal-welfare'
  | 'food-agriculture'
  | 'technology-digital'
  | 'tourism'
  | 'employment-enterprise'
  | 'irish-language'

export type Demographic =
  | 'children-0-11'
  | 'young-people-12-24'
  | 'older-people-65-plus'
  | 'people-with-disabilities'
  | 'experiencing-homelessness'
  | 'migrants-refugees'
  | 'traveller-roma'
  | 'lgbtiq-plus'
  | 'women-girls'
  | 'men-boys'
  | 'lone-parents'
  | 'long-term-unemployed'
  | 'people-in-recovery'
  | 'rural-communities'
  | 'coastal-communities'
  | 'general-public'

export type County =
  | 'carlow' | 'cavan' | 'clare' | 'cork' | 'donegal' | 'dublin'
  | 'galway' | 'kerry' | 'kildare' | 'kilkenny' | 'laois' | 'leitrim'
  | 'limerick' | 'longford' | 'louth' | 'mayo' | 'meath' | 'monaghan'
  | 'offaly' | 'roscommon' | 'sligo' | 'tipperary' | 'waterford'
  | 'westmeath' | 'wexford' | 'wicklow'

export type GrantWritingCapacity = 'none' | 'some' | 'experienced'

export type ProfileSection =
  | 'identity'
  | 'location'
  | 'contact'
  | 'capacity'
  | 'activities'
  | 'grant-experience'

export interface Organisation {
  id: string
  name: string
  legalName?: string
  orgType: OrgType
  charityNumber?: string
  companyNumber?: string
  taxExemptionRef?: string
  yearFounded: number
  description: string
  mission: string
  website?: string
  addressLine1: string
  addressLine2?: string
  town: string
  county: County
  eircode?: string
  setting: OrgSetting
  geographicReach: GeographicReach
  contactName: string
  contactRole: string
  contactEmail: string
  contactPhone?: string
  staffCount: number
  volunteerCount: number
  budgetRange: BudgetRange
  activityAreas: ActivityArea[]
  targetDemographics: Demographic[]
  hasGrantExperience: boolean
  previousGrantsDetail?: string
  largestGrantReceived?: string
  grantWritingCapacity: GrantWritingCapacity
  createdAt: string
  updatedAt: string
}

export type OrgProfileFormData = Omit<Organisation, 'id' | 'createdAt' | 'updatedAt'>

export interface ProfileSectionMeta {
  id: ProfileSection
  label: string
  description: string
  icon: string
}
