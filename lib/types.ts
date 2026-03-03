export type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING" | "RESOLVED" | "CLOSED"
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
export type TicketCategory = "BUG" | "FEATURE" | "SUPPORT" | "INFRASTRUCTURE" | "SECURITY"

export interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "AGENT" | "USER"
  avatar?: string
}

export interface Ticket {
  id: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  createdAt: string
  updatedAt: string
  createdBy: User
  assignee?: User
  sla: {
    responseDeadline: string
    resolutionDeadline: string
    respondedAt?: string
    resolvedAt?: string
    isResponseBreached: boolean
    isResolutionBreached: boolean
  }
  attachments: Attachment[]
  tags: string[]
}

export interface Comment {
  id: string
  ticketId: string
  author: User
  content: string
  createdAt: string
  isInternal: boolean
}

export interface AuditEntry {
  id: string
  ticketId: string
  user: User
  action: string
  field: string
  oldValue?: string
  newValue?: string
  timestamp: string
}

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
  uploadedBy: User
}

export interface Notification {
  id: string
  type: "SLA_WARNING" | "ESCALATION" | "ASSIGNMENT" | "COMMENT" | "STATUS_CHANGE"
  title: string
  message: string
  ticketId: string
  read: boolean
  createdAt: string
}
