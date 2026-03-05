
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// --- TYPE DEFINITIONS ---
export type UserRole = 'student' | 'instructor';

interface User {
  name: string;
  role: UserRole;
}

interface StudentData {
  name: string;
  belt: 'White' | 'Blue' | 'Purple' | 'Brown' | 'Black';
  stripes: number;
  classesAttended: number;
  streak: number;
  goals: { title: string; current: number; target: number }[];
  badges: string[];
}

interface Class {
  id: string;
  name: string;
  startTime: Date;
  instructor: string;
  status: 'open' | 'closed';
  attendees: string[];
}

interface CheckInContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  currentUser: StudentData;
  classes: Class[];
  activeClass: Class | null;
  createClass: (newClass: { name: string; startTime: Date; instructor: string }) => void;
  toggleCheckInStatus: (classId: string) => void;
  checkIn: (name: string) => void;
  hasScanned: boolean;
  markAsScanned: () => void;
}

// --- MOCK DATA ---
const mockStudent: StudentData = {
  name: 'John Flow',
  belt: 'Blue',
  stripes: 3,
  classesAttended: 128,
  streak: 12,
  goals: [
    { title: 'Next Stripe', current: 128, target: 150 },
    { title: 'Competition Prep', current: 80, target: 100 },
    { title: 'Takedown Mastery', current: 30, target: 40 },
  ],
  badges: ['Consistency King', 'Early Bird', 'Matador', 'Ironman'],
};

const mockClasses: Class[] = [
  { 
    id: 'cl-1', 
    name: 'Morning Fundamentals', 
    startTime: new Date(new Date().setHours(7, 0, 0, 0)), 
    instructor: 'Gordo', 
    status: 'open',
    attendees: ['Alex', 'Bethany', 'Carlos', 'Diana', 'Evan']
  },
  { 
    id: 'cl-2', 
    name: 'Advanced No-Gi', 
    startTime: new Date(new Date().setHours(18, 30, 0, 0)), 
    instructor: 'Helio', 
    status: 'closed',
    attendees: ['Frank', 'Gina', 'Harold', 'Ivy', 'Jack', 'Karen', 'Liam']
   },
];

const CheckInContext = createContext<CheckInContextType | undefined>(undefined);

export function CheckInProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [hasScanned, setHasScanned] = useState(false);

  const activeClass = classes.find(c => c.status === 'open') || classes[0];

  const login = (role: UserRole) => {
    setUser({ name: role === 'student' ? mockStudent.name : 'Instructor', role });
    setHasScanned(false);
  };

  const logout = () => {
    setUser(null);
    setHasScanned(false);
  };

  const markAsScanned = () => {
    setHasScanned(true);
  };

  const createClass = (newClassData: { name: string; startTime: Date; instructor: string }) => {
    const newClass: Class = {
      ...newClassData,
      id: `cl-${classes.length + 1}`,
      status: 'closed',
      attendees: [],
    };
    setClasses(prev => [newClass, ...prev]);
  };

  const toggleCheckInStatus = (classId: string) => {
    setClasses(prev => prev.map(c => 
      c.id === classId ? { ...c, status: c.status === 'open' ? 'closed' : 'open' } : c
    ));
  };

  const checkIn = (name: string) => {
    setClasses(prev => prev.map(c => 
      c.status === 'open' ? { ...c, attendees: [name, ...c.attendees] } : c
    ));
  };
  
  const value = {
    user,
    login,
    logout,
    currentUser: mockStudent,
    classes,
    activeClass,
    createClass,
    toggleCheckInStatus,
    checkIn,
    hasScanned,
    markAsScanned,
  };

  return <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>;
}

export function useCheckIn() {
  const context = useContext(CheckInContext);
  if (context === undefined) {
    throw new Error('useCheckIn must be used within a CheckInProvider');
  }
  return context;
}
