// lib/settings_api.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export const API_BASE_URL = 'https://admins-manager.vercel.app/api/v1';

// تعريف الأنواع (Types)
interface AccountInfo {
  name: string;
  email: string;
  id: number;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface AccountUpdateData {
  name: string;
  email: string;
}

interface SendResetCodeData {
  email: string;
}

interface VerifyResetCodeData {
  email: string;
  reset_code: string;
}

interface ResetPasswordData {
  temp_token: string;
  new_password: string;
}

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  temp_token?: string;
}

// Account settings API calls
export const useAccountInfo = () => {
  return useQuery<AccountInfo>({
    queryKey: ['account-info'],
    queryFn: async (): Promise<AccountInfo> => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin';
        }
        throw new Error('Failed to fetch account info');
      }
      
      return response.json();
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse, Error, AccountUpdateData>({
    mutationFn: async (accountData: AccountUpdateData): Promise<ApiResponse> => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin';
        }
        throw new Error('Failed to update account');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-info'] });
      toast({
        title: "تم تحديث البيانات",
        description: "تم تحديث بيانات الحساب بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث بيانات الحساب",
        variant: "destructive",
      });
    },
  });
};

export const useSendResetCode = () => {
  const { toast } = useToast();

  return useMutation<ApiResponse, Error, SendResetCodeData>({
    mutationFn: async (data: SendResetCodeData): Promise<ApiResponse> => {
      const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset code');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم إرسال الكود",
        description: "تم إرسال كود التحقق إلى بريدك الإلكتروني",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: "فشل في إرسال كود التحقق",
        variant: "destructive",
      });
    },
  });
};

export const useVerifyResetCode = () => {
  const { toast } = useToast();

  return useMutation<ApiResponse, Error, VerifyResetCodeData>({
    mutationFn: async (data: VerifyResetCodeData): Promise<ApiResponse> => {
      const response = await fetch(`${API_BASE_URL}/users/verify-reset-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify reset code');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم التحقق من الكود",
        description: "تم التحقق من الكود بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: "كود التحقق غير صحيح",
        variant: "destructive",
      });
    },
  });
};

export const useResetPassword = () => {
  const { toast } = useToast();

  return useMutation<ApiResponse, Error, ResetPasswordData>({
    mutationFn: async (data: ResetPasswordData): Promise<ApiResponse> => {
      const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم تغيير كلمة المرور",
        description: "تم تغيير كلمة المرور بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: "فشل في تغيير كلمة المرور",
        variant: "destructive",
      });
    },
  });
};