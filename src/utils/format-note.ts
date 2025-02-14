import { FormattedNoteResponse, PlanItem } from 'types/types';

export function formatNote(data: any): FormattedNoteResponse {
  return {
    ...data,
    checklist: JSON.parse(data.checklist),
    plan: JSON.parse(data.plan) as PlanItem[]
  };
}
