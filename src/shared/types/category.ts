export interface Category {
  id: string;
  topicId: string;
  name: string;
  description?: string;
  assignedStaff: string[];
}
