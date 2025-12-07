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

export const PetManager: React.FC<PetManagerProps> = ({ currentUser, pets, onAddPet, onUpdatePet, onDeletePet, onLogout }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'weight' | 'medical' | 'deworm'>('daily');

  // Daily Log State
  const [logFood, setLogFood] = useState('');
  const [logWater, setLogWater] = useState('');
  
  // Medical Record State
  const [medTitle, setMedTitle] = useState('');
  const [medDesc, setMedDesc] = useState('');

  // Deworm State
  const [wormName, setWormName] = useState('');
  const [wormDate, setWormDate] = useState('');

  // Weight State
  const [newWeight, setNewWeight] = useState('');
  const [weightDate, setWeightDate] = useState(new Date().toISOString().split('T')[0]);

  // Memo State
  const [memoText, setMemoText] = useState('');
  const [isEditingMemo, setIsEditingMemo] = useState(false);

  // Checkup Date State
  const [checkupDate, setCheckupDate] = useState('');
  const [isEditingCheckup, setIsEditingCheckup] = useState(false);

  const selectedPet = pets.find(p => p.id === selectedPetId);

  // Update local state when selected pet changes
  React.useEffect(() => {
    if (selectedPet) {
        setMemoText(selectedPet.memo || '');
        setCheckupDate(selectedPet.nextCheckupDate || '');
    }
  }, [selectedPetId, selectedPet]);

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

  const getPetTypeLabel = (t: PetType) => {
    switch (t) {
      case PetType.CAT: return '猫';
      case PetType.DOG: return '狗';
      case PetType.RABBIT: return '兔子';
      case PetType.HAMSTER: return '仓鼠';
      case PetType.SQUIRREL: return '松鼠';
      case PetType.GOLDFISH: return '金鱼';
      case PetType.TURTLE: return '乌龟';
      case PetType.PARROT: return '鹦鹉';
      default: return '其他';
    }
  };

  const getPetEmoji = (t: PetType) => {
    switch (t) {
      case PetType.CAT: return '🐱';
      case PetType.DOG: return '🐶';
      case PetType.RABBIT: return '🐰';
      case PetType.HAMSTER: return '🐹';
      case PetType.SQUIRREL: return '🐿️';
      case PetType.GOLDFISH: return '🐠';
      case PetType.TURTLE: return '🐢';
      case PetType.PARROT: return '🦜';
      default: return '🐾';
    }
  };

  const calculateDaysLeft = (targetDate?: string) => {
      if (!targetDate) return null;
      const today = new Date();
      today.setHours(0,0,0,0);
      const target = new Date(targetDate);
      target.setHours(0,0,0,0);
      
      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
  };

  const handleAddPet = (pet: Pet) => {
    onAddPet(pet);
    setShowAddModal(false);
  };

  const handleDeletePet = (id: string) => {
    if(confirm('确定要删除这个宠物吗？')) {
        onDeletePet(id);
        setSelectedPetId(null);
    }
  }

  const saveMemo = () => {
      if (!selectedPet) return;
      onUpdatePet({ ...selectedPet, memo: memoText });
      setIsEditingMemo(false);
  };

  const saveCheckupDate = () => {
      if (!selectedPet) return;
      onUpdatePet({ ...selectedPet, nextCheckupDate: checkupDate });
      setIsEditingCheckup(false);
  };

  const addDailyLog = () => {
    if (!selectedPet) return;
    const newLog: DailyLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      foodAmount: Number(logFood) || 0,
      waterAmount: Number(logWater) || 0
    };
    const updatedPet = { ...selectedPet, dailyLogs: [newLog, ...selectedPet.dailyLogs] };
    onUpdatePet(updatedPet);
    setLogFood('');
    setLogWater('');
  };

  const addWeightRecord = () => {
    if (!selectedPet || !newWeight) return;
    const weightVal = parseFloat(newWeight);
    const newRecord: WeightRecord = {
        id: Date.now().toString(),
        date: weightDate,
        weight: weightVal
    };
    
    const updatedRecords = [newRecord, ...(selectedPet.weightRecords || [])].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const updatedPet = { 
        ...selectedPet, 
        weightRecords: updatedRecords,
        weight: updatedRecords[0].weight 
    };
    
    onUpdatePet(updatedPet);
    setNewWeight('');
  };

  const addMedicalRecord = () => {
    if (!selectedPet) return;
    const newRec: MedicalRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: medTitle,
      description: medDesc
    };
    const updatedPet = { ...selectedPet, medicalRecords: [newRec, ...selectedPet.medicalRecords] };
    onUpdatePet(updatedPet);
    setMedTitle('');
    setMedDesc('');
  };

  const addDewormRecord = () => {
    if(!selectedPet) return;
    const newRec: DewormingRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        medicationName: wormName,
        nextDueDate: wormDate,
        type: 'Internal' 
    };
    const updatedPet = { ...selectedPet, dewormingRecords: [newRec, ...selectedPet.dewormingRecords] };
    onUpdatePet(updatedPet);
    setWormName('');
    setWormDate('');
  }

  // --- Render List View ---
  if (!selectedPetId) {
    return (
      <div className="pb-24 pt-6 px-4 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
             <img src={currentUser.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
             <div>
                <h1 className="text-xl font-bold text-gray-800">你好, {currentUser.username}</h1>
                <p className="text-xs text-gray-500">今天也要好好照顾它们哦</p>
             </div>
          </div>
          <div className="flex space-x-2">
             <button
                onClick={onLogout}
                className="bg-white text-gray-600 p-2 rounded-full shadow-sm border border-gray-100 hover:bg-gray-50"
             >
                <LogOut size={20} />
             </button>
             <button 
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
             >
                <Plus size={24} />
             </button>
          </div>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <span className="text-3xl">🐾</span>
            </div>
            <p className="text-gray-500 mb-4">还没有添加宠物哦</p>
            <button 
                onClick={() => setShowAddModal(true)}
                className="text-indigo-600 font-medium hover:underline"
            >
                点击添加第一只宠物
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pets.map(pet => (
              <div 
                key={pet.id} 
                onClick={() => setSelectedPetId(pet.id)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-all"
              >
                <img src={pet.avatarUrl} alt={pet.name} className="w-16 h-16 rounded-full object-cover bg-gray-200" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
                        {getPetEmoji(pet.type)} {pet.gender === 'Male' ? 'DD' : 'MM'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{pet.breed || getPetTypeLabel(pet.type)} · {calculateAge(pet.birthDate)}</p>
                </div>
                <ChevronRight className="text-gray-300" />
              </div>
            ))}
          </div>
        )}

        {showAddModal && <PetForm onSave={handleAddPet} onCancel={() => setShowAddModal(false)} />}
      </div>
    );
  }

  // Helper to render Reminder Card
  const renderReminder = (title: string, date: string | undefined, type: 'checkup' | 'deworm') => {
      const daysLeft = calculateDaysLeft(date);
      let statusColor = 'bg-green-100 text-green-700';
      let iconColor = 'text-green-500';
      
      if (daysLeft === null) {
          statusColor = 'bg-gray-100 text-gray-500';
          iconColor = 'text-gray-400';
      } else if (daysLeft < 0) {
          statusColor = 'bg-red-100 text-red-700';
          iconColor = 'text-red-500';
      } else if (daysLeft <= 7) {
          statusColor = 'bg-orange-100 text-orange-700';
          iconColor = 'text-orange-500';
      }

      return (
          <div className="flex-1 bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-start mb-2">
                 <span className="text-xs font-bold text-gray-500">{title}</span>
                 <AlarmClock size={14} className={iconColor} />
             </div>
             
             {type === 'checkup' && isEditingCheckup ? (
                 <div className="flex flex-col space-y-2">
                     <input 
                        type="date" 
                        className="text-xs border rounded p-1"
                        value={checkupDate}
                        onChange={(e) => setCheckupDate(e.target.value)}
                     />
                     <button onClick={saveCheckupDate} className="text-xs bg-indigo-600 text-white rounded px-2 py-1">保存</button>
                 </div>
             ) : (
                <div onClick={() => type === 'checkup' && setIsEditingCheckup(true)} className={type === 'checkup' ? "cursor-pointer hover:opacity-70" : ""}>
                    {date ? (
                        <>
                            <div className="text-lg font-bold text-gray-800 leading-none mb-1">
                                {daysLeft !== null && daysLeft < 0 ? `逾期${Math.abs(daysLeft)}` : daysLeft}
                                <span className="text-xs font-normal ml-0.5">天</span>
                            </div>
                            <div className={`text-[10px] inline-block px-1.5 py-0.5 rounded-full ${statusColor}`}>
                                {date}
                            </div>
                        </>
                    ) : (
                        <div className="text-sm text-gray-400 py-2">点击设置</div>
                    )}
                </div>
             )}
          </div>
      );
  };

  const nextDewormDate = selectedPet && selectedPet.dewormingRecords.length > 0 ? selectedPet.dewormingRecords[0].nextDueDate : undefined;

  // --- Render Detail View ---
  if (!selectedPet) return null;

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button onClick={() => setSelectedPetId(null)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <span className="font-bold text-lg">{selectedPet.name} 的主页</span>
          <button onClick={() => handleDeletePet(selectedPet.id)} className="p-2 -mr-2 text-red-400 hover:bg-red-50 rounded-full">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Pet Summary Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 pb-12 rounded-b-[2rem] shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Activity size={120} />
        </div>
        <div className="flex items-center space-x-6 relative z-10 max-w-lg mx-auto">
            <img src={selectedPet.avatarUrl} className="w-20 h-20 rounded-full border-4 border-white/30 shadow-md" alt="Avatar"/>
            <div>
                <h2 className="text-2xl font-bold">{selectedPet.name}</h2>
                <div className="flex items-center space-x-3 mt-2 text-indigo-100">
                    <span className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-lg text-xs backdrop-blur-sm">
                        <span>🎂</span>
                        <span>{calculateAge(selectedPet.birthDate)}</span>
                    </span>
                    <span className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-lg text-xs backdrop-blur-sm">
                        <span>⚖️</span>
                        <span>{selectedPet.weight}kg</span>
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 relative z-20 space-y-4">
        
        {/* Memo & Reminders Section */}
        <div className="flex flex-col space-y-4">
             {/* Memo Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center">
                        📝 备忘录
                    </h3>
                    {!isEditingMemo ? (
                        <button onClick={() => setIsEditingMemo(true)} className="text-indigo-600 hover:bg-indigo-50 p-1 rounded transition-colors">
                            <Edit3 size={16} />
                        </button>
                    ) : (
                        <button onClick={saveMemo} className="text-green-600 hover:bg-green-50 p-1 rounded transition-colors">
                            <Save size={16} />
                        </button>
                    )}
                </div>
                {isEditingMemo ? (
                    <textarea 
                        className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-indigo-500"
                        rows={2}
                        placeholder="记录它的性格、喜好..."
                        value={memoText}
                        onChange={(e) => setMemoText(e.target.value)}
                    />
                ) : (
                    <p className="text-sm text-gray-600 min-h-[1.5rem] whitespace-pre-wrap">
                        {selectedPet.memo || "暂无记录，点击右上角编辑添加~"}
                    </p>
                )}
            </div>

            {/* Health Reminders */}
            <div className="flex space-x-3">
                {renderReminder("下次驱虫", nextDewormDate, 'deworm')}
                {renderReminder("下次体检", selectedPet.nextCheckupDate, 'checkup')}
            </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-1.5 flex overflow-x-auto no-scrollbar">
          {[
            { id: 'daily', label: '日常', icon: Utensils },
            { id: 'weight', label: '体重', icon: Scale },
            { id: 'medical', label: '病历', icon: Stethoscope },
            { id: 'deworm', label: '驱虫', icon: Syringe },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="animate-fade-in pb-4">
          {activeTab === 'daily' && (
            <>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                        <Plus className="w-5 h-5 mr-2 text-indigo-500" />
                        今日记录
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                            <label className="text-xs text-orange-600 font-semibold mb-1 block">进食 (g)</label>
                            <input 
                                type="number" 
                                value={logFood}
                                onChange={e => setLogFood(e.target.value)}
                                className="w-full bg-transparent text-xl font-bold text-gray-800 outline-none placeholder-gray-300"
                                placeholder="0"
                            />
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <label className="text-xs text-blue-600 font-semibold mb-1 block">饮水 (ml)</label>
                            <input 
                                type="number" 
                                value={logWater}
                                onChange={e => setLogWater(e.target.value)}
                                className="w-full bg-transparent text-xl font-bold text-gray-800 outline-none placeholder-gray-300"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={addDailyLog}
                        disabled={!logFood && !logWater}
                        className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                        打卡记录
                    </button>
                </div>

                <div className="space-y-3 mt-4">
                    <h4 className="text-sm font-semibold text-gray-500 ml-1">最近记录</h4>
                    {selectedPet.dailyLogs.length === 0 ? (
                        <p className="text-center text-gray-400 py-4 text-sm">暂无记录，快去打卡吧~</p>
                    ) : (
                        selectedPet.dailyLogs.slice(0, 5).map(log => (
                            <div key={log.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                                <span className="text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</span>
                                <div className="flex space-x-4">
                                    {log.foodAmount > 0 && <span className="flex items-center text-orange-600 text-sm font-medium"><Utensils size={14} className="mr-1"/> {log.foodAmount}g</span>}
                                    {log.waterAmount > 0 && <span className="flex items-center text-blue-600 text-sm font-medium"><Droplets size={14} className="mr-1"/> {log.waterAmount}ml</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </>
          )}

          {activeTab === 'weight' && (
              <>
                 <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                        <Scale className="w-5 h-5 mr-2 text-indigo-500" />
                        记录体重
                    </h3>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="relative">
                             <input 
                                type="date"
                                value={weightDate}
                                onChange={e => setWeightDate(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 mb-3"
                            />
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex items-center justify-between">
                            <label className="text-sm text-indigo-600 font-semibold">体重 (kg)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={newWeight}
                                onChange={e => setNewWeight(e.target.value)}
                                className="w-32 text-right bg-transparent text-xl font-bold text-gray-800 outline-none placeholder-gray-300"
                                placeholder="0.0"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={addWeightRecord}
                        disabled={!newWeight}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        保存记录
                    </button>
                 </div>
                 
                 <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-500 ml-1">体重变化曲线</h4>
                    {(selectedPet.weightRecords || []).length === 0 ? (
                        <p className="text-center text-gray-400 py-4 text-sm">还没有称重记录哦</p>
                    ) : (
                        (selectedPet.weightRecords || []).map(record => (
                            <div key={record.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                                <span className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</span>
                                <span className="text-lg font-bold text-indigo-900">{record.weight} kg</span>
                            </div>
                        ))
                    )}
                </div>
              </>
          )}

          {activeTab === 'medical' && (
             <>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                    <h3 className="font-bold text-gray-800 mb-3">添加病历</h3>
                    <input 
                        className="w-full border-b border-gray-200 py-2 mb-3 outline-none text-sm focus:border-indigo-500 transition-colors"
                        placeholder="病症标题 (如：拉肚子)"
                        value={medTitle}
                        onChange={e => setMedTitle(e.target.value)}
                    />
                    <textarea 
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all mb-3"
                        rows={3}
                        placeholder="详细描述及诊断结果..."
                        value={medDesc}
                        onChange={e => setMedDesc(e.target.value)}
                    ></textarea>
                     <button 
                        onClick={addMedicalRecord}
                        disabled={!medTitle}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        保存病历
                    </button>
                </div>
                <div className="space-y-3">
                    {selectedPet.medicalRecords.map(rec => (
                        <div key={rec.id} className="bg-white p-4 rounded-xl border-l-4 border-red-400 shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-gray-800">{rec.title}</h4>
                                <span className="text-xs text-gray-400">{new Date(rec.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-600">{rec.description}</p>
                        </div>
                    ))}
                </div>
             </>
          )}

          {activeTab === 'deworm' && (
             <>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                    <h3 className="font-bold text-gray-800 mb-3">添加驱虫记录</h3>
                    <div className="grid grid-cols-1 gap-3 mb-3">
                         <input 
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                            placeholder="药品名称 (如：大宠爱)"
                            value={wormName}
                            onChange={e => setWormName(e.target.value)}
                        />
                         <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 w-16">下次日期:</span>
                            <input 
                                type="date"
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                value={wormDate}
                                onChange={e => setWormDate(e.target.value)}
                            />
                        </div>
                    </div>
                     <button 
                        onClick={addDewormRecord}
                        disabled={!wormName}
                        className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                        打卡驱虫
                    </button>
                </div>
                <div className="space-y-3">
                    {selectedPet.dewormingRecords.map(rec => (
                        <div key={rec.id} className="bg-white p-4 rounded-xl border border-green-100 flex items-center justify-between shadow-sm">
                             <div>
                                <h4 className="font-bold text-gray-800 text-sm">{rec.medicationName}</h4>
                                <p className="text-xs text-gray-500 mt-1">记录: {new Date(rec.date).toLocaleDateString()}</p>
                             </div>
                             <div className="text-right">
                                <span className="block text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                                    下次: {rec.nextDueDate || '未设置'}
                                </span>
                             </div>
                        </div>
                    ))}
                </div>
             </>
          )}
        </div>
      </div>
    </div>
  );
};