
import React, { useState, useEffect } from 'react';
import { Pet, User, Post, Comment } from './types';
import { Navigation } from './components/Navigation';
import { PetManager } from './views/PetManager';
import { CareGuide } from './views/CareGuide';
import { FoodChecker } from './views/FoodChecker';
import { Auth } from './views/Auth';
import { Community } from './views/Community';

/**
 * App 核心管理组件
 * 负责全局状态维护（用户、宠物列表、帖子）以及数据本地持久化
 */
const App: React.FC = () => {
  // 核心状态
  const [currentUser, setCurrentUser] = useState<User | null>(null); // 当前登录用户
  const [currentView, setCurrentView] = useState('pets'); // 当前路由/视图
  const [allPets, setAllPets] = useState<Pet[]>([]); // 所有宠物数据
  const [posts, setPosts] = useState<Post[]>([]); // 社区帖子数据

  // 初始化：从 localStorage 加载保存的数据
  useEffect(() => {
    const session = localStorage.getItem('app_current_user');
    if (session) setCurrentUser(JSON.parse(session));

    const savedPets = localStorage.getItem('app_pets');
    if (savedPets) setAllPets(JSON.parse(savedPets));

    const savedPosts = localStorage.getItem('app_posts');
    if (savedPosts) setPosts(JSON.parse(savedPosts));
  }, []);

  // 持久化：当数据发生变化时，保存到本地存储
  useEffect(() => {
    localStorage.setItem('app_pets', JSON.stringify(allPets));
  }, [allPets]);

  useEffect(() => {
    localStorage.setItem('app_posts', JSON.stringify(posts));
  }, [posts]);

  // 用户操作处理器
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('app_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('app_current_user');
    setCurrentView('pets');
  };

  // 宠物管理逻辑：过滤出属于当前用户的宠物
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

  // 社区交互逻辑
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

  // 如果未登录，只渲染登录界面
  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  // 根据当前 currentView 切换视图
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
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <main className="w-full mx-auto">
        {renderView()}
      </main>
      {/* 底部导航栏 */}
      <Navigation currentView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;
