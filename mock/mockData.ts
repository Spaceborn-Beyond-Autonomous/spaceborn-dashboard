export interface User {
  id: number;
  name: string;
  role: "admin" | "core" | "employee";
  email: string;
  password: string;
}

export interface Project {
  id: number;
  name: string;
  status: "Running" | "Planning" | "Completed";
  assignedTo: number[];
}

export interface Task {
  id: number;
  title: string;
  status: "In Progress" | "Completed" | "Pending";
  assignedTo: number;
  deadline: string;
}

export interface Team {
  id: number;
  name: string;
  members: number[];
}

export interface Revenue {
  total: number;
  pending: number;
  completed: number;
}

export const users: User[] = [
  { id: 1, name: "Admin User", role: "admin", email: "admin@company.com", password: "admin123" },
  { id: 2, name: "Core Member", role: "core", email: "core@company.com", password: "core123" },
  { id: 3, name: "Employee", role: "employee", email: "employee@company.com", password: "emp123" }
];

export const projects: Project[] = [
  { id: 1, name: "Website Revamp", status: "Running", assignedTo: [3] },
  { id: 2, name: "Mobile App", status: "Planning", assignedTo: [2, 3] },
  { id: 3, name: "API Integration", status: "Completed", assignedTo: [2] }
];

export const tasks: Task[] = [
  { id: 1, title: "Design Landing Page", status: "In Progress", assignedTo: 3, deadline: "2025-11-25" },
  { id: 2, title: "Setup Database", status: "Completed", assignedTo: 2, deadline: "2025-11-20" },
  { id: 3, title: "User Testing", status: "Pending", assignedTo: 3, deadline: "2025-12-01" }
];

export const teams: Team[] = [
  { id: 1, name: "UI Team", members: [2, 3] },
  { id: 2, name: "Backend Team", members: [1, 2] },
  { id: 3, name: "QA Team", members: [3] }
];

export const revenue: Revenue = { total: 120000, pending: 30000, completed: 90000 };
