import React, { useState } from 'react';
import { PetType, SafetyLevel, FoodSafetyResult } from '../types';
import { checkFoodSafety } from '../services/geminiService';
import { Search, AlertTriangle, CheckCircle, HelpCircle, AlertOctagon, Loader2 } from 'lucide-react';

export const FoodChecker: React.FC = () => {
  const [foodName, setFoodName] = useState('');
  const [selectedType, setSelectedType] = useState<PetType>(PetType.CAT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodSafetyResult | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    setLoading(true);
    setResult(null);
    const res = await checkFoodSafety(foodName, selectedType);
    setResult(res);
    setLoading(false);
  };

  const getStatusColor = (level: SafetyLevel) => {
    switch (level) {
      case SafetyLevel.SAFE: return 'text-green-600 bg-green-50 border-green-200';
      case SafetyLevel.CAUTION: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case SafetyLevel.DANGEROUS: return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (level: SafetyLevel) => {
    switch (level) {
      case SafetyLevel.SAFE: return <CheckCircle className="w-12 h-12 text-green-500" />;
      case SafetyLevel.CAUTION: return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
      case SafetyLevel.DANGEROUS: return <AlertOctagon className="w-12 h-12 text-red-500" />;
      default: return <HelpCircle className="w-12 h-12 text-gray-400" />;
    }
  };

  const getStatusText = (level: SafetyLevel) => {
    switch (level) {
      case SafetyLevel.SAFE: return '可以食用';
      case SafetyLevel.CAUTION: return '慎重喂食';
      case SafetyLevel.DANGEROUS: return '严禁食用';
      default: return '未知风险';
    }
  };

  const getPetTypeLabel = (t: PetType) => {
    switch (t) {
      case PetType.CAT: return '猫咪';
      case PetType.DOG: return '狗狗';
      case PetType.RABBIT: return '兔子';
      case PetType.HAMSTER: return '仓鼠';
      case PetType.SQUIRREL: return '松鼠';
      case PetType.GOLDFISH: return '金鱼';
      case PetType.TURTLE: return '乌龟';
      case PetType.PARROT: return '鹦鹉';
      default: return '其他';
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-lg mx-auto min-h-screen bg-gray-50">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">能不能吃?</h1>
        <p className="text-gray-500 text-sm">AI 智能查询，守护爱宠肠胃健康</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <form onSubmit={handleCheck} className="space-y-4">
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
             {Object.values(PetType).filter(t => t !== PetType.OTHER).map(t => (
                 <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedType(t)}
                    className={`flex-shrink-0 px-3 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                        selectedType === t 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                    }`}
                 >
                    {getPetTypeLabel(t)}
                 </button>
             ))}
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="输入食物名称，如：巧克力、葡萄..."
              className="w-full pl-4 pr-12 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-gray-800"
            />
            <button 
                type="submit"
                disabled={loading || !foodName}
                className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white rounded-lg px-3 flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className={`rounded-2xl p-6 border animate-fade-in text-center ${getStatusColor(result.safetyLevel)}`}>
          <div className="flex justify-center mb-4">
             {getStatusIcon(result.safetyLevel)}
          </div>
          <h2 className="text-2xl font-bold mb-1">{getStatusText(result.safetyLevel)}</h2>
          <p className="text-sm opacity-80 mb-4">{result.petType} & {result.foodName}</p>
          
          <div className="bg-white/60 rounded-xl p-4 text-left backdrop-blur-sm">
            <h3 className="font-bold text-sm mb-1 opacity-90">分析结果：</h3>
            <p className="text-sm leading-relaxed">{result.explanation}</p>
            {result.nutritionalValue && (
                <p className="text-xs mt-3 pt-3 border-t border-black/5 opacity-70">
                    营养提示: {result.nutritionalValue}
                </p>
            )}
          </div>
        </div>
      )}

      {!result && !loading && (
          <div className="mt-8 text-center opacity-40">
              <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-xl"><span className="text-2xl block mb-2">🍫</span><span className="text-xs">巧克力</span></div>
                  <div className="bg-white p-3 rounded-xl"><span className="text-2xl block mb-2">🍇</span><span className="text-xs">葡萄</span></div>
                  <div className="bg-white p-3 rounded-xl"><span className="text-2xl block mb-2">🥛</span><span className="text-xs">牛奶</span></div>
              </div>
          </div>
      )}
    </div>
  );
};