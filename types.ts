
/**
 * 宠物种类枚举：定义系统中支持的所有动物类型
 */
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

/**
 * 性别枚举
 */
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female'
}

/**
 * 用户信息接口：用于身份验证和社区展示
 */
export interface User {
  id: string;
  username: string;
  password: string; // 示例代码中使用明文存储，实际开发中应加密
  avatar: string;
}

/**
 * 帖子评论接口
 */
export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

/**
 * 社区动态（帖子）接口
 */
export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  likes: string[]; // 存储点赞用户的 ID 列表
  comments: Comment[];
  timestamp: string;
}

/**
 * 医疗病历记录
 */
export interface MedicalRecord {
  id: string;
  date: string;
  title: string;
  description: string;
  cost?: number;
}

/**
 * 驱虫记录
 */
export interface DewormingRecord {
  id: string;
  date: string;
  medicationName: string;
  nextDueDate: string;
  type: 'Internal' | 'External' | 'Combined';
}

/**
 * 日常打卡日志（饮食/饮水）
 */
export interface DailyLog {
  id: string;
  date: string;
  foodAmount: number; // 克 (g)
  waterAmount: number; // 毫升 (ml)
  notes?: string;
}

/**
 * 体重记录：用于追踪宠物生长或健康曲线
 */
export interface WeightRecord {
  id: string;
  date: string;
  weight: number; // 千克 (kg)
}

/**
 * 宠物核心对象接口：包含所有宠物相关的数据和历史记录
 */
export interface Pet {
  id: string;
  ownerId: string; // 关联 User ID
  name: string;
  type: PetType;
  breed?: string;
  gender: Gender;
  birthDate?: string;
  weight: number; // 当前最新体重
  weightRecords: WeightRecord[];
  avatarUrl?: string;
  medicalRecords: MedicalRecord[];
  dewormingRecords: DewormingRecord[];
  dailyLogs: DailyLog[];
  memo?: string; // 备忘录：如个性、过敏源等
  nextCheckupDate?: string; // 计划下次体检日期
  nextDewormDate?: string; // 计划下一次驱虫日期
}

/**
 * AI 安全检查等级枚举
 */
export enum SafetyLevel {
  SAFE = 'SAFE',       // 可以安全食用
  CAUTION = 'CAUTION', // 需谨慎（如少量、去籽等）
  DANGEROUS = 'DANGEROUS', // 有毒或严重危害
  UNKNOWN = 'UNKNOWN'  // 无法判断
}

/**
 * AI 食物查询结果接口
 */
export interface FoodSafetyResult {
  foodName: string;
  petType: string;
  safetyLevel: SafetyLevel;
  explanation: string; // AI 提供的详细解释
  nutritionalValue?: string; // AI 提供的营养提示
}
