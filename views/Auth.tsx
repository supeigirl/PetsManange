import React, { useState } from 'react';
import { User } from '../types';
import { LogIn, UserPlus, PawPrint } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users: User[] = JSON.parse(localStorage.getItem('app_users') || '[]');

    if (isRegistering) {
      if (users.find(u => u.username === username)) {
        setError('用户名已存在');
        return;
      }
      const newUser: User = {
        id: Date.now().toString(),
        username,
        password,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`
      };
      const updatedUsers = [...users, newUser];
      localStorage.setItem('app_users', JSON.stringify(updatedUsers));
      onLogin(newUser);
    } else {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('用户名或密码错误');
      }
    }
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-indigo-50 p-8 text-center border-b border-indigo-100">
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-md mb-4 text-indigo-600">
            <PawPrint size={40} />
          </div>
          <h1 className="text-2xl font-bold text-indigo-900 mb-2">健康管理助手</h1>
          <p className="text-gray-500 text-sm mt-1">您的智能养宠管家</p>
        </div>

        <form onSubmit={handleAuth} className="p-8 space-y-5">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
            {isRegistering ? '注册账号' : '欢迎回来'}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="请输入密码"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center"
          >
            {isRegistering ? <UserPlus size={20} className="mr-2"/> : <LogIn size={20} className="mr-2"/>}
            {isRegistering ? '立即注册' : '登录'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-sm text-indigo-600 hover:underline"
            >
              {isRegistering ? '已有账号？去登录' : '没有账号？去注册'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};