interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  createdBy: string;
  dueDate?: string;
  assignedTo?: string;
}

interface Participant {
  email: string;
  role: 'admin' | 'viewer';
  userId?: string;
}

interface TodoList {
  id: string;
  title: string;
  ownerId: string;
  participants: Participant[];
  tasks: Task[];
  createdAt: string;
}

export type { Task, Participant, TodoList };