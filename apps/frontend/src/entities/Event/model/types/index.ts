export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number;

  recurrenceType?: string;
  recurrenceDays?: string[];
  recurrenceStart?: Date;
  recurrenceEnd?: Date;
  parentId?: string;
  parent?: Event;
  publicationGroups?: {
    id: string;
    name: string;
    status: string;
  }[];
}
