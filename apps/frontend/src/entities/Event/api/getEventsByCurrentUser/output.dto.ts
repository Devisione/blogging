export type GetEventsByCurrentUserOutputDto = {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  duration: number;

  recurrenceType?: string;
  recurrenceDays?: string[];
  recurrenceStart?: string;
  recurrenceEnd?: string;
  parentId?: string;
}[];
