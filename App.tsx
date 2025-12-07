import React, { useState, useEffect } from 'react';
import { Pet } from './types';
import { Navigation } from './components/Navigation';
import { PetManager } from './views/PetManager';
import { CareGuide } from './views/CareGuide';
import { FoodChecker } from './views/FoodChecker';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('pets');
  
  // Load pets from local storage or default to empty array
  const [pets, setPets] = useState<Pet[]>(() => {
    const saved = localStorage.getItem('my_pets');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist pets to local storage
  useEffect(() => {
    localStorage.setItem('my_pets', JSON.stringify(pets));
  }, [pets]);

  const renderView = () => {
    switch (currentView) {
      case 'pets':
        return <PetManager pets={pets} setPets={setPets} />;
      case 'guide':
        return <CareGuide />;
      case 'food':
        return <FoodChecker />;
      default:
        return <PetManager pets={pets} setPets={setPets} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <main className="w-full mx-auto">
        {renderView()}
      </main>
      <Navigation currentView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;