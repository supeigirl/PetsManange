import React, { useState } from 'react';
import { User, Post } from '../types';
import { Heart, MessageCircle, Send, PlusCircle } from 'lucide-react';

interface CommunityProps {
  currentUser: User;
  posts: Post[];
  onAddPost: (content: string) => void;
  onLikePost: (postId: string) => void;
}

export const Community: React.FC<CommunityProps> = ({ currentUser, posts, onAddPost, onLikePost }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    onAddPost(newPostContent);
    setNewPostContent('');
    setShowInput(false);
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-lg mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 z-10 py-2">
        <h1 className="text-2xl font-bold text-gray-800">宠友圈</h1>
        <button
          onClick={() => setShowInput(!showInput)}
          className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors"
        >
          <PlusCircle size={28} />
        </button>
      </div>

      {showInput && (
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 animate-fade-in">
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full border-gray-200 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none"
              rows={3}
              placeholder="分享你和萌宠的趣事..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newPostContent.trim()}
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center"
              >
                <Send size={14} className="mr-1" /> 发布
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>还没有帖子，来发布第一条吧！</p>
          </div>
        ) : (
          posts.map(post => {
            const isLiked = post.likes.includes(currentUser.id);
            return (
              <div key={post.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-3">
                  <img src={post.userAvatar} alt={post.username} className="w-10 h-10 rounded-full bg-gray-200 border border-gray-100" />
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 text-sm">{post.username}</h3>
                    <p className="text-xs text-gray-400">{getTimeAgo(post.timestamp)}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                  <button 
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center space-x-1 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                    <span>{post.likes.length > 0 ? post.likes.length : '赞'}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-sm text-gray-400 hover:text-gray-600">
                    <MessageCircle size={18} />
                    <span>评论</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};