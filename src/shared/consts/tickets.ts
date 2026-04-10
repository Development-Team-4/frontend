export const statusOrder = {
  OPEN: 0,
  ASSIGNED: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  CLOSED: 4,
} as const;

export const statusStyles = {
  OPEN: 'bg-chart-1/15 text-chart-1',
  ASSIGNED: 'bg-blue-500/15 text-blue-500',
  IN_PROGRESS: 'bg-chart-2/15 text-chart-2',
  RESOLVED: 'bg-success/15 text-success',
  CLOSED: 'bg-muted text-muted-foreground',
} as const;

export const statusLabels = {
  OPEN: 'Открыт',
  ASSIGNED: 'Назначен',
  IN_PROGRESS: 'В процессе',
  RESOLVED: 'Решён',
  CLOSED: 'Закрыт',
} as const;

export const STATUS_COLORS = {
  OPEN: 'oklch(0.65 0.19 250)',
  ASSIGNED: 'oklch(0.72 0.16 165)',
  IN_PROGRESS: 'oklch(0.70 0.18 150)',
  RESOLVED: 'oklch(0.68 0.19 45)',
  CLOSED: 'oklch(0.45 0.01 260)',
} as const;

export const STATUS_LABELS = {
  OPEN: 'Открыт',
  ASSIGNED: 'Назначен',
  IN_PROGRESS: 'В процессе',
  RESOLVED: 'Решён',
  CLOSED: 'Закрыт',
} as const;
