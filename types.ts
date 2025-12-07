export enum PetType {
  CAT = 'Cat',
  DOG = 'Dog',
  RABBIT = 'Rabbit',
  HAMSTER = 'Hamster',
  SQUIRREL = 'Squirrel',
  GOLDFISH = 'Goldfish',
  TURTLE = 'Turtle',
  PARROT = 'Parrot',
  OTHER = 'Other'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female'
}

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, never store plain text
  avatar: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  likes: string[]; // Array of userIds who liked
  comments: Comment[];
  timestamp: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  title: string;
  description: string;
  cost?: number;
}

export interface DewormingRecord {
  id: string;
  date: string;
  medicationName: string;
  nextDueDate: string;
  type: 'Internal' | 'External' | 'Combined';
}

export interface DailyLog {
  id: string;
  date: string;
  foodAmount: number; // in grams
  waterAmount: number; // in ml
  notes?: string;
}

export interface WeightRecord {
  id: string;
  date: string;
  weight: number; // in kg
}

export interface Pet {
  id: string;
  ownerId: string; // Link to User
  name: string;
  type: PetType;
  breed?: string;
  gender: Gender;
  birthDate?: string;
  weight: number; // current weight in kg
  weightRecords: WeightRecord[];
  avatarUrl?: string;
  medicalRecords: MedicalRecord[];
  dewormingRecords: DewormingRecord[];
  dailyLogs: DailyLog[];
  memo?: string; // Personality and preferences
  nextCheckupDate?: string; // Target date for next vet visit
}

export enum SafetyLevel {
  SAFE = 'SAFE',
  CAUTION = 'CAUTION',
  DANGEROUS = 'DANGEROUS',
  UNKNOWN = 'UNKNOWN'
}

export interface FoodSafetyResult {
  foodName: string;
  petType: string;
  safetyLevel: SafetyLevel;
  explanation: string;
  nutritionalValue?: string;
}

export interface CareGuideSection {
  title: string;
  content: string;
}

export interface BreedInfo {
  name: string;
  description: string;
  careTips: string[];
}

export interface PetCareGuide {
  petType: PetType;
  overview: string;
  feeding: string[];
  environment: string[];
  taboos: string[];
  breeds: BreedInfo[];
}