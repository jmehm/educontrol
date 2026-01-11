
export type UserRole = 'Admin' | 'DirectorGeneral' | 'DirectorSeccion' | 'Coordinacion' | 'Prefectura' | 'Docente';

export interface SchoolSection {
  id: string;
  name: string;
  color: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentId: string;
  groupId: string;
  sectionId: string;
  status: 'active' | 'inactive';
  attendanceCount: number;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  sectionIds: string[];
  imageUrl?: string;
}

export interface ScheduleItem {
  id: string;
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
  startTime: string;
  endTime: string;
  subject: string;
  classroom: string;
  teacherId: string;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
  teacherId: string;
  sectionId: string;
  schedule: ScheduleItem[];
  studentCount: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  groupId: string;
  studentId: string;
  status: 'present' | 'absent' | 'late';
  recordedBy: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  sectionId?: string; // Para Directores de Sección
  email: string;
  status: 'active' | 'pending';
}

export type ViewType = 'dashboard' | 'students' | 'teachers' | 'groups' | 'attendance' | 'schedule' | 'assistant' | 'admin-panel';
