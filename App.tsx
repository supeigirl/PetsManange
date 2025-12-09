import React, { useState, useEffect } from 'react';
import { Pet, User, Post, Comment } from './types';
import { Navigation } from './components/Navigation';
import { PetManager } from './views/PetManager';
import { CareGuide } from './views/CareGuide';
import { FoodChecker } from './views/FoodChecker';
import { Auth } from './views/Auth';
import { Community } from './views/Community';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('pets');
  
  // -- Data State --
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  // -- Initialization --
  useEffect(() => {
    // Check login session
    const session = localStorage.getItem('app_current_user');
    if (session) {
      setCurrentUser(JSON.parse(session));
    }

    // Load data
    const savedPets = localStorage.getItem('app_pets');
    if (savedPets) setAllPets(JSON.parse(savedPets));

    const savedPosts = localStorage.getItem('app_posts');
    if (savedPosts) setPosts(JSON.parse(savedPosts));
  }, []);

  // -- Persistence --
  useEffect(() => {
    localStorage.setItem('app_pets', JSON.stringify(allPets));
  }, [allPets]);

  useEffect(() => {
    localStorage.setItem('app_posts', JSON.stringify(posts));
  }, [posts]);

  // -- Auth Handlers --
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('app_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('app_current_user');
    setCurrentView('pets');
  };

  // -- Pet CRUD --
  // Filter pets for the current user
  const userPets = allPets.filter(p => p.ownerId === currentUser?.id);

  const handleAddPet = (pet: Pet) => {
    if (!currentUser) return;
    const newPet = { ...pet, ownerId: currentUser.id };
    setAllPets([...allPets, newPet]);
  };

  const handleUpdatePet = (updatedPet: Pet) => {
    setAllPets(allPets.map(p => p.id === updatedPet.id ? updatedPet : p));
  };

  const handleDeletePet = (id: string) => {
    setAllPets(allPets.filter(p => p.id !== id));
  };

  // -- Community Handlers --
  const handleAddPost = (content: string) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      content,
      likes: [],
      comments: [],
      timestamp: new Date().toISOString()
    };
    setPosts([newPost, ...posts]);
  };

  const handleLikePost = (postId: string) => {
    if (!currentUser) return;
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(currentUser.id);
        const newLikes = isLiked 
          ? post.likes.filter(id => id !== currentUser.id)
          : [...post.likes, currentUser.id];
        return { ...post, likes: newLikes };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string, content: string) => {
    if (!currentUser) return;
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: Date.now().toString(),
          userId: currentUser.id,
          username: currentUser.username,
          userAvatar: currentUser.avatar,
          content,
          timestamp: new Date().toISOString()
        };
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'pets':
        return (
          <PetManager 
            currentUser={currentUser}
            pets={userPets} 
            onAddPet={handleAddPet}
            onUpdatePet={handleUpdatePet}
            onDeletePet={handleDeletePet}
            onLogout={handleLogout}
          />
        );
      case 'community':
        return (
          <Community 
            currentUser={currentUser}
            posts={posts}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
          />
        );
      case 'guide':
        return <CareGuide />;
      case 'food':
        return <FoodChecker />;
      default:
        return (
          <PetManager 
            currentUser={currentUser}
            pets={userPets} 
            onAddPet={handleAddPet}
            onUpdatePet={handleUpdatePet}
            onDeletePet={handleDeletePet}
            onLogout={handleLogout}
          />
        );
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