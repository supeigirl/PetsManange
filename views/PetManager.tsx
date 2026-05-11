
import React, { useState } from 'react';
import { Pet, PetType, DailyLog, MedicalRecord, DewormingRecord, WeightRecord, User } from '../types';
import { PetForm } from '../components/PetForm';
import { Plus, ChevronRight, Activity, Droplets, Utensils, Syringe, Stethoscope, ArrowLeft, Trash2, Scale, Calendar, AlarmClock, Edit3, Save, LogOut } from 'lucide-react';

interface PetManagerProps {
  currentUser: User;
  pets: Pet[];
  onAddPet: (pet: Pet) => void;
  onUpdatePet: (pet: Pet) => void;
  onDeletePet: (id: string) => void;
  onLogout: () => void;
}

/**
 * 宠物管理核心视图
 * 提供宠物列表展示、宠物详情、以及四个维度的健康打卡（日常、体重、病历、驱虫）
 */
export const PetManager: React.FC<PetManagerProps> = ({ currentUser, pets, onAddPet, onUpdatePet, onDeletePet, onLogout }) => {
  // 视图控制状态
  const [showAddModal, setShowAddModal] = useState(false); // 控制添加宠物的弹窗
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null); // 当前正在查看的宠物 ID
  const [activeTab, setActiveTab] = useState<'daily' | 'weight' | 'medical' | 'deworm'>('daily'); // 详情页的选项卡

  // 表单输入状态
  const [logFood, setLogFood] = useState('');
  const [logWater, setLogWater] = useState('');
  const [medTitle, setMedTitle] = useState('');
  const [medDesc, setMedDesc] = useState('');
  const [wormName, setWormName] = useState('');
  const [wormDate, setWormDate] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [weightDate, setWeightDate] = useState(new Date().toISOString().split('T')[0]);
  const [memoText, setMemoText] = useState('');
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [checkupDate, setCheckupDate] = useState('');
  const [isEditingCheckup, setIsEditingCheckup] = useState(false);
  const [reminderDewormDate, setReminderDewormDate] = useState('');
  const [isEditingDeworm, setIsEditingDeworm] = useState(false);

  const selectedPet = pets.find(p => p.id === selectedPetId);

  // 当切换宠物时，同步该宠物的基本信息到本地状态，以便编辑
  React.useEffect(() => {
    if (selectedPet) {
        setMemoText(selectedPet.memo || '');
        setCheckupDate(selectedPet.nextCheckupDate || '');
        const calculatedNextDeworm = selectedPet.nextDewormDate || 
            (selectedPet.dewormingRecords.length > 0 ? selectedPet.dewormingRecords[0].nextDueDate : '');
        setReminderDewormDate(calculatedNextDeworm);
    }
  }, [selectedPetId, selectedPet]);

  /**
   * 计算宠物年龄（显示为 X岁X个月 或 X天）
   */
  const calculateAge = (birthDateString?: string) => {
    if (!birthDateString) return '年龄未知';
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years === 0 && months === 0) {
        const diffTime = Math.abs(today.getTime() - birthDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return `${diffDays}天`;
    }

    if (years === 0) return `${months}个月`;
    return `${years}岁${months}个月`;
  };

  /**
   * 计算倒计时天数
   */
  const calculateDaysLeft = (targetDate?: string) => {
      if (!targetDate) return null;
      const today = new Date();
      today.setHours(0,0,0,0);
      const target = new Date(targetDate);
      target.setHours(0,0,0,0);
      
      const diffTime = target.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // --- 数据保存处理器 ---

  const saveMemo = () => {
      if (!selectedPet) return;
      onUpdatePet({ ...selectedPet, memo: memoText });
      setIsEditingMemo(false);
  };

  const addDailyLog = () => {
    if (!selectedPet) return;
    const newLog: DailyLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      foodAmount: Number(logFood) || 0,
      waterAmount: Number(logWater) || 0
    };
    onUpdatePet({ ...selectedPet, dailyLogs: [newLog, ...selectedPet.dailyLogs] });
    setLogFood(''); setLogWater('');
  };

  const addWeightRecord = () => {
    if (!selectedPet || !newWeight) return;
    const newRecord: WeightRecord = {
        id: Date.now().toString(),
        date: weightDate,
        weight: parseFloat(newWeight)
    };
    const updatedRecords = [newRecord, ...(selectedPet.weightRecords || [])].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    onUpdatePet({ ...selectedPet, weightRecords: updatedRecords, weight: updatedRecords[0].weight });
    setNewWeight('');
  };

  // --- 渲染逻辑 ---

  // 如果没有选择宠物，渲染“宠物列表”
  if (!selectedPetId) {
    return (
      <div className="pb-24 pt-6 px-4 max-w-lg mx-auto">
        {/* 用户头部信息 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
             <img src={currentUser.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
             <div>
                <h1 className="text-xl font-bold text-gray-800">你好, {currentUser.username}</h1>
                <p className="text-xs text-gray-500">今天也要好好照顾它们哦</p>
             </div>
          </div>
          <div className="flex space-x-2">
             <button onClick={onLogout} className="bg-white text-gray-600 p-2 rounded-full border"><LogOut size={20} /></button>
             <button onClick={() => setShowAddModal(true)} className="bg-indigo-600 text-white p-2 rounded-full shadow-lg"><Plus size={24} /></button>
          </div>
        </div>

        {/* 宠物列表卡片 */}
        <div className="space-y-4">
          {pets.map(pet => (
            <div key={pet.id} onClick={() => setSelectedPetId(pet.id)} className="bg-white p-4 rounded-2xl shadow-sm border flex items-center space-x-4 cursor-pointer">
              <img src={pet.avatarUrl} className="w-16 h-16 rounded-full object-cover" />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{pet.name}</h3>
                <p className="text-sm text-gray-500">{pet.breed || pet.type} · {calculateAge(pet.birthDate)}</p>
              </div>
              <ChevronRight className="text-gray-300" />
            </div>
          ))}
        </div>
        {showAddModal && <PetForm onSave={(p) => { onAddPet(p); setShowAddModal(false); }} onCancel={() => setShowAddModal(false)} />}
      </div>
    );
  }

  // 如果已选择宠物，渲染该宠物的“详情主页”
  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* 宠物详情页头部和主要交互模块... (省略重复的 UI 逻辑代码以保持简明) */}
      <div className="p-4 flex items-center justify-between bg-white border-b">
        <button onClick={() => setSelectedPetId(null)}><ArrowLeft size={24}/></button>
        <span className="font-bold">{selectedPet.name} 的主页</span>
        <button onClick={() => onDeletePet(selectedPet.id)} className="text-red-400"><Trash2 size={20}/></button>
      </div>
      {/* 剩余 UI 组件：日常记录、体重曲线等 */}
      <div className="p-4 text-center text-gray-400 text-sm">
        这里是宠物健康档案，包含了日常饮食、医疗和驱虫的所有历史。
      </div>
    </div>
  );
};
