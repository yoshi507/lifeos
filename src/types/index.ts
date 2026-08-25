export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in-progress" | "done";

export interface TaskList {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  goalId?: string;
  listId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay: boolean;
  color?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  progress: number;
  targetDate?: string;
  createdAt: string;
  status: "active" | "completed" | "paused";
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: "daily" | "weekly";
  streak: number;
  bestStreak: number;
  completedDates: string[];
  color?: string;
  createdAt: string;
}

export type ReminderRepeat = "none" | "daily" | "weekly" | "weekdays" | "monthly";

export interface Reminder {
  id: string;
  title: string;
  message?: string;
  datetime: string;
  repeat: ReminderRepeat;
  enabled: boolean;
  lastFired?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "reminder";
  read: boolean;
  createdAt: string;
}

export interface UserSettings {
  name: string;
  email: string;
  theme: "light" | "dark" | "system";
  weekStartsOn: 0 | 1;
  aiEnabled: boolean;
  onboardingComplete: boolean;
  notificationsEnabled?: boolean;
}

export interface ProductivityStats {
  tasksCompletedThisWeek: number;
  tasksCompletedLastWeek: number;
  habitsCompletedToday: number;
  focusMinutes: number;
  streakDays: number;
}

export type AIAction =
  | { type: "create_task"; data: Partial<Task> & { title: string } }
  | { type: "create_event"; data: Partial<CalendarEvent> & { title: string; start: string } }
  | { type: "create_note"; data: Partial<Note> & { title: string } }
  | { type: "create_goal"; data: Partial<Goal> & { title: string } }
  | { type: "create_habit"; data: Partial<Habit> & { title: string } }
  | { type: "create_reminder"; data: Partial<Reminder> & { title: string; datetime: string } }
  | { type: "update_task"; id: string; data: Partial<Task> }
  | { type: "complete_task"; id: string }
  | { type: "message"; content: string };

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  actions?: AIAction[];
}
