import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!email.trim() || !password.trim()) {
      setMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', email.trim()); 
      formData.append('password', password.trim());

      const response = await fetch('https://admins-manager.vercel.app/api/v1/users/token', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
      });

      const data = await response.json();

      if (response.ok) {
        // حفظ التوكن
        try {
          localStorage.setItem('adminToken', data.access_token);
        } catch (e) {
          (window as any).adminToken = data.access_token;
        }
        
        // التوجيه المباشر
        window.location.replace('/admin/dashboard');
        
      } else {
        if (response.status === 401) {
          setMessage("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        } else {
          setMessage("حدث خطأ أثناء تسجيل الدخول");
        }
      }
    } catch (error) {
      setMessage("خطأ في الاتصال. تحقق من اتصالك بالإنترنت");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl text-center font-bold text-gray-800">لوحة التحكم</CardTitle>
          <p className="text-gray-600 text-center">تسجيل دخول المدير</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {message && (
              <div className="p-4 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {message}
              </div>
            )}
            
            <div className="space-y-6">
              <div className="relative">
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  onKeyPress={handleKeyPress}
                  className="w-full h-14 pr-12 pl-4 text-right border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-800 bg-white"
                  style={{ direction: 'rtl' }}
                  required
                  autoComplete="username"
                  disabled={isLoading}
                />
                <label 
                  htmlFor="email" 
                  className={`absolute right-10 bg-white px-2 pointer-events-none transition-all duration-300 ${
                    focusedField === 'email' || email 
                      ? '-top-3 text-sm text-blue-600 font-medium' 
                      : 'top-1/2 -translate-y-1/2 text-gray-500'
                  }`}
                >
                  البريد الإلكتروني أو اليوزر
                </label>
              </div>

              <div className="relative">
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  onKeyPress={handleKeyPress}
                  className="w-full h-14 pr-12 pl-12 text-right border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-800 bg-white"
                  style={{ direction: 'rtl' }}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                <label 
                  htmlFor="password" 
                  className={`absolute right-10 bg-white px-2 pointer-events-none transition-all duration-300 ${
                    focusedField === 'password' || password 
                      ? '-top-3 text-sm text-blue-600 font-medium' 
                      : 'top-1/2 -translate-y-1/2 text-gray-500'
                  }`}
                >
                  كلمة المرور
                </label>
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
              disabled={isLoading || !email.trim() || !password.trim()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                  جاري التحقق...
                </div>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200" dir="rtl">
              <p className="text-sm text-gray-700 text-center font-medium mb-2">بيانات تجريبية:</p>
              <div className="space-y-1 text-sm text-gray-600 text-center">
                <p><span className="font-medium">البريد:</span> user@example.com</p>
                <p><span className="font-medium">كلمة المرور:</span> Admin123123</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;