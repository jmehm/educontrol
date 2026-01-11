
import { Student, Teacher, Group, SchoolSection } from './types';

// Fix: Update SECTIONS to match the SchoolSection interface using objects instead of strings
export const SECTIONS: SchoolSection[] = [
  { id: 'sec_kin', name: 'Kinder', color: 'pink' },
  { id: 'sec_pri', name: 'Primaria', color: 'blue' },
  { id: 'sec_sec', name: 'Secundaria', color: 'indigo' },
  { id: 'sec_bac', name: 'Bachillerato', color: 'emerald' },
];

// Fix: Update property 'sections' to 'sectionIds' and use IDs to match Teacher type
export const INITIAL_TEACHERS: Teacher[] = [
  { id: 't1', name: 'Dr. Roberto Sánchez', email: 'roberto.s@edu.com', subject: 'Matemáticas', sectionIds: ['sec_sec', 'sec_bac'] },
  { id: 't2', name: 'Mtra. Elena Gómez', email: 'elena.g@edu.com', subject: 'Español', sectionIds: ['sec_pri'] },
  { id: 't3', name: 'Ing. Carlos Ruiz', email: 'carlos.r@edu.com', subject: 'Ciencias', sectionIds: ['sec_sec'] },
  { id: 't4', name: 'Lic. Martha Sosa', email: 'martha.s@edu.com', subject: 'Educación Inicial', sectionIds: ['sec_kin'] },
];

// Fix: Update property 'section' to 'sectionId' and use IDs to match Group type
export const INITIAL_GROUPS: Group[] = [
  { 
    id: 'g1', 
    name: '3º Kinder - A', 
    teacherId: 't4', 
    sectionId: 'sec_kin',
    studentCount: 15,
    schedule: [
      { id: 's1', day: 'Lunes', startTime: '09:00', endTime: '11:00', subject: 'Psicomotricidad', classroom: 'Salón Nube', teacherId: 't4', groupId: 'g1' },
    ]
  },
  { 
    id: 'g2', 
    name: '6º Primaria - B', 
    teacherId: 't2', 
    sectionId: 'sec_pri',
    studentCount: 22,
    schedule: [
      { id: 's2', day: 'Martes', startTime: '08:00', endTime: '10:00', subject: 'Español', classroom: 'Aula 204', teacherId: 't2', groupId: 'g2' },
    ]
  },
  { 
    id: 'g3', 
    name: '2º Secundaria - C', 
    teacherId: 't1', 
    sectionId: 'sec_sec',
    studentCount: 28,
    schedule: [
      { id: 's3', day: 'Miércoles', startTime: '10:00', endTime: '12:00', subject: 'Álgebra', classroom: 'Laboratorio A', teacherId: 't1', groupId: 'g3' },
    ]
  },
];

// Fix: Update property 'section' to 'sectionId' and use IDs to match Student type
export const INITIAL_STUDENTS: Student[] = [
  { id: 'st1', name: 'Ana Martínez', email: 'ana@mail.com', enrollmentId: 'K-001', groupId: 'g1', sectionId: 'sec_kin', status: 'active', attendanceCount: 12 },
  { id: 'st2', name: 'Juan Pérez', email: 'juan@mail.com', enrollmentId: 'P-002', groupId: 'g2', sectionId: 'sec_pri', status: 'active', attendanceCount: 10 },
  { id: 'st3', name: 'Sofía Lara', email: 'sofia@mail.com', enrollmentId: 'S-003', groupId: 'g3', sectionId: 'sec_sec', status: 'active', attendanceCount: 15 },
];
