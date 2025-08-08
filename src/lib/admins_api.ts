// lib/supervisors_api.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Base URL for API
const BASE_URL ='https://admins-manager.vercel.app/api/v1';

// Types
interface Supervisor {
  id: number;
  name: string;
  email: string;
  role: 'supervisor';
  created_at: string;
  is_active: boolean;
  admin_id?: number;
}

interface SupervisorData {
  name: string;
  email: string;
  password: string;
  role: 'supervisor';
  admin_id?: number;
}

interface CreateSupervisorResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  is_active: boolean;
  admin_id?: number;
}

interface UpdateSupervisorPayload {
  id: number;
  supervisorData: Omit<SupervisorData, 'password' | 'role'>;
}

interface DeleteSupervisorResponse {
  message: string;
}

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Helper function to create headers
const createHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API Functions
const createSupervisor = async (supervisorData: SupervisorData): Promise<CreateSupervisorResponse> => {
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(supervisorData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'فشل في إنشاء المشرف');
  }

  return response.json();
};

const fetchSupervisors = async (): Promise<Supervisor[]> => {
  const response = await fetch(`${BASE_URL}/users/supervisors`, {
    headers: createHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'فشل في جلب المشرفين');
  }

  return response.json();
};

const updateSupervisor = async (id: number, supervisorData: Omit<SupervisorData, 'password' | 'role'>): Promise<Supervisor> => {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: createHeaders(),
    body: JSON.stringify(supervisorData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'فشل في تحديث المشرف');
  }

  return response.json();
};

const deleteSupervisor = async (id: number): Promise<DeleteSupervisorResponse> => {
  const response = await fetch(`${BASE_URL}/users/supervisors/${id}`, {
    method: 'DELETE',
    headers: createHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'فشل في حذف المشرف');
  }

  return response.json();
};

const toggleSupervisorStatus = async (id: number): Promise<Supervisor> => {
  const response = await fetch(`${BASE_URL}/users/${id}/toggle-status`, {
    method: 'PATCH',
    headers: createHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'فشل في تغيير حالة المشرف');
  }

  return response.json();
};

// Function to validate supervisor data
const validateSupervisorData = (supervisorData: SupervisorData): string[] => {
  const errors: string[] = [];
  
  if (!supervisorData.name || supervisorData.name.trim().length < 2) {
    errors.push('الاسم الكامل يجب أن يحتوي على أكثر من حرفين');
  }
  
  if (!supervisorData.email || !supervisorData.email.includes('@')) {
    errors.push('البريد الإلكتروني غير صالح');
  }
  
  if (!supervisorData.password || supervisorData.password.length < 8) {
    errors.push('كلمة المرور يجب أن تحتوي على أكثر من 8 أحرف');
  }
  
  return errors;
};

// Supervisors management API calls
export const useSupervisors = () => {
  return useQuery<Supervisor[], Error>({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisors,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateSupervisor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<CreateSupervisorResponse, Error, SupervisorData>({
    mutationFn: async (supervisorData: SupervisorData): Promise<CreateSupervisorResponse> => {
      // Validate input data
      const validationErrors = validateSupervisorData(supervisorData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      return await createSupervisor(supervisorData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['supervisors'] });
      toast({
        title: "تم إنشاء المشرف",
        description: `تم إنشاء المشرف ${data.name} بنجاح`,
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في إنشاء المشرف",
        description: error.message || "فشل في إنشاء المشرف",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSupervisor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Supervisor, Error, UpdateSupervisorPayload>({
    mutationFn: async ({ id, supervisorData }: UpdateSupervisorPayload): Promise<Supervisor> => {
      // Validate input data (excluding password)
      const errors: string[] = [];
      
      if (!supervisorData.name || supervisorData.name.trim().length < 2) {
        errors.push('الاسم الكامل يجب أن يحتوي على أكثر من حرفين');
      }
      
      if (!supervisorData.email || !supervisorData.email.includes('@')) {
        errors.push('البريد الإلكتروني غير صالح');
      }
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      return await updateSupervisor(id, supervisorData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['supervisors'] });
      queryClient.invalidateQueries({ queryKey: ['supervisor', data.id] });
      toast({
        title: "تم تحديث المشرف",
        description: `تم تحديث بيانات المشرف ${data.name} بنجاح`,
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث المشرف",
        description: error.message || "فشل في تحديث المشرف",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSupervisor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<DeleteSupervisorResponse, Error, number>({
    mutationFn: async (supervisorId: number): Promise<DeleteSupervisorResponse> => {
      return await deleteSupervisor(supervisorId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['supervisors'] });
      toast({
        title: "تم حذف المشرف",
        description: data.message || "تم حذف المشرف بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حذف المشرف",
        description: error.message || "فشل في حذف المشرف",
        variant: "destructive",
      });
    },
  });
};

export const useToggleSupervisorStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Supervisor, Error, number>({
    mutationFn: async (supervisorId: number): Promise<Supervisor> => {
      return await toggleSupervisorStatus(supervisorId);
    },
    onSuccess: (updatedSupervisor) => {
      queryClient.invalidateQueries({ queryKey: ['supervisors'] });
      queryClient.invalidateQueries({ queryKey: ['supervisor', updatedSupervisor.id] });
      toast({
        title: updatedSupervisor.is_active ? "تم تفعيل المشرف" : "تم إلغاء تفعيل المشرف",
        description: `تم ${updatedSupervisor.is_active ? 'تفعيل' : 'إلغاء تفعيل'} المشرف ${updatedSupervisor.name} بنجاح`,
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في تغيير حالة المشرف",
        description: error.message || "فشل في تغيير حالة المشرف",
        variant: "destructive",
      });
    },
  });
};

// Helper function to get supervisor by ID
export const useSupervisorById = (supervisorId: number) => {
  return useQuery<Supervisor, Error>({
    queryKey: ['supervisor', supervisorId],
    queryFn: async (): Promise<Supervisor> => {
      const response = await fetch(`${BASE_URL}/users/${supervisorId}`, {
        headers: createHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'فشل في جلب المشرف');
      }

      return response.json();
    },
    enabled: !!supervisorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Helper function to get all users (for admin dashboard)
export const useAllUsers = () => {
  return useQuery<Supervisor[], Error>({
    queryKey: ['users'],
    queryFn: async (): Promise<Supervisor[]> => {
      const response = await fetch(`${BASE_URL}/users`, {
        headers: createHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'فشل في جلب المستخدمين');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Helper function to get current user profile
export const useCurrentUser = () => {
  return useQuery<Supervisor, Error>({
    queryKey: ['current-user'],
    queryFn: async (): Promise<Supervisor> => {
      const response = await fetch(`${BASE_URL}/users/me`, {
        headers: createHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'فشل في جلب بيانات المستخدم');
      }

      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Update current user profile
export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Supervisor, Error, Omit<SupervisorData, 'password' | 'role'>>({
    mutationFn: async (userData: Omit<SupervisorData, 'password' | 'role'>): Promise<Supervisor> => {
      const response = await fetch(`${BASE_URL}/users/me`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'فشل في تحديث الملف الشخصي');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      toast({
        title: "تم تحديث الملف الشخصي",
        description: `تم تحديث بياناتك الشخصية بنجاح`,
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث الملف الشخصي",
        description: error.message || "فشل في تحديث الملف الشخصي",
        variant: "destructive",
      });
    },
  });
};

// Delete current user account
export const useDeleteCurrentUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<{ message: string }, Error, void>({
    mutationFn: async (): Promise<{ message: string }> => {
      const response = await fetch(`${BASE_URL}/users/me`, {
        method: 'DELETE',
        headers: createHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'فشل في حذف الحساب');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      localStorage.removeItem('adminToken');
      localStorage.removeItem('refresh_token');
      toast({
        title: "تم حذف الحساب",
        description: "تم حذف حسابك بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حذف الحساب",
        description: error.message || "فشل في حذف الحساب",
        variant: "destructive",
      });
    },
  });
};