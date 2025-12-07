import React, { useState } from 'react';
import { Pet, PetType, Gender } from '../types';
import { X, Camera } from 'lucide-react';

interface PetFormProps {
  onSave: (pet: Pet) => void;
  onCancel: () => void;
}

export const PetForm: React.FC<PetFormProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<PetType>(PetType.CAT);
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [weight, setWeight] = useState('');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const getPetTypeLabel = (t: PetType) => {
    switch (t) {
      case PetType.CAT: return '猫';
      case PetType.DOG: return '狗';
      case PetType.RABBIT: return '兔子';
      case PetType.HAMSTER: return '仓鼠/金丝熊';
      case PetType.SQUIRREL: return '松鼠';
      case PetType.GOLDFISH: return '金鱼';
      case PetType.TURTLE: return '乌龟';
      case PetType.PARROT: return '鹦鹉';
      default: return '其他';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const initialWeight = parseFloat(weight) || 0;
    const newPet: Pet = {
      id: Date.now().toString(),
      ownerId: '', // Placeholder, will be overwritten by parent component
      name,
      type,
      gender,
      weight: initialWeight,
      breed,
      birthDate,
      medicalRecords: [],
      dewormingRecords: [],
      dailyLogs: [],
      weightRecords: initialWeight > 0 ? [{
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        weight: initialWeight
      }] : [],
      avatarUrl: `https://picsum.photos/seed/${name}${Date.now()}/200/200`
    };
    onSave(newPet);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-fade-in-up">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
          <h2 className="text-lg font-bold text-indigo-900">添加新宠物</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-400 border-2 border-dashed border-indigo-200">
              <Camera size={32} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名字</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="例如：咪咪"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">种类</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as PetType)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none bg-white"
              >
                {Object.values(PetType).map(t => (
                  <option key={t} value={t}>{getPetTypeLabel(t)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setGender(Gender.MALE)}
                  className={`flex-1 text-sm py-1.5 rounded-md transition-all ${gender === Gender.MALE ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500'}`}
                >
                  公
                </button>
                <button
                  type="button"
                  onClick={() => setGender(Gender.FEMALE)}
                  className={`flex-1 text-sm py-1.5 rounded-md transition-all ${gender === Gender.FEMALE ? 'bg-white shadow text-pink-500 font-medium' : 'text-gray-500'}`}
                >
                  母
                </button>
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">出生日期 (用于计算年龄)</label>
             <input 
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">当前体重 (kg)</label>
              <input 
                type="number"
                step="0.01"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">品种 (选填)</label>
              <input 
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none"
                placeholder="例如：布偶"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            保存信息
          </button>
        </form>
      </div>
    </div>
  );
};