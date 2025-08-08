//src/components/admin/settings/adminManagement.tsx

import React, { useState } from "react";
import {
  Shield,
  UserPlus,
  Edit2,
  Trash2,
  User,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  Info,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useSupervisors,
  useCreateSupervisor,
  useUpdateSupervisor,
  useDeleteSupervisor,
  useToggleSupervisorStatus,
} from "@/lib/admins_api";
import { useToast } from "@/hooks/use-toast";

// Types
interface Admin {
  id: number;
  name: string;
  email: string;
  created_at: string;
  is_active: boolean;
}

interface AdminForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Delete Confirmation Dialog Component
const DeleteConfirmDialog: React.FC<{
  adminId: number;
  adminName: string;
  adminEmail: string;
  onConfirm: () => void;
  children: React.ReactNode;
}> = ({ adminId, adminName, adminEmail, onConfirm, children }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="text-right" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>تأكيد حذف المشرف</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد من حذف المشرف <strong>{adminName}</strong>({adminEmail}
            )؟
            <br />
            <span className="text-red-600 font-medium">
              هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع البيانات المرتبطة
              بهذا المشرف.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            حذف المشرف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const AdminManagement: React.FC = () => {
  const [showAdminDialog, setShowAdminDialog] = useState<boolean>(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const { toast } = useToast();

  // Admin form states
  const [adminForm, setAdminForm] = useState<AdminForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [emailError, setEmailError] = useState<string>("");

  // API hooks
  const { data: admins, isLoading: adminsLoading } = useSupervisors();
  const createAdminMutation = useCreateSupervisor();
  const updateAdminMutation = useUpdateSupervisor();
  const deleteAdminMutation = useDeleteSupervisor();
  const toggleAdminStatusMutation = useToggleSupervisorStatus();

  const handleAdminSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (adminForm.password !== adminForm.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    if (adminForm.password.length < 8) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور يجب أن تحتوي على أكثر من 8 أحرف",
        variant: "destructive",
      });
      return;
    }

    if (adminForm.name.trim().length < 2) {
      toast({
        title: "خطأ في الاسم",
        description: "الاسم الكامل يجب أن يحتوي على أكثر من حرفين",
        variant: "destructive",
      });
      return;
    }

    if (!adminForm.email.includes("@")) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "البريد الإلكتروني غير صالح",
        variant: "destructive",
      });
      return;
    }

    const adminData = {
      name: adminForm.name.trim(),
      email: adminForm.email.trim(),
      password: adminForm.password,
      role: "supervisor" as const,
    };

    if (editingAdmin) {
      updateAdminMutation.mutate(
        {
          id: editingAdmin.id,
          supervisorData: { name: adminData.name, email: adminData.email },
        },
        {
          onSuccess: () => {
            toast({
              title: "تم تحديث المشرف",
              description: "تم تحديث بيانات المشرف بنجاح",
            });
            resetAdminForm();
          },
          onError: (error) => {
            toast({
              title: "خطأ في التحديث",
              description: "فشل في تحديث بيانات المشرف",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createAdminMutation.mutate(adminData, {
        onSuccess: () => {
          toast({
            title: "تم إضافة المشرف",
            description: "تم إضافة المشرف الجديد بنجاح",
          });
          resetAdminForm();
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.detail || error?.message || "";
          if (errorMessage.includes("Email already registered") || errorMessage.includes("already exists")) {
            setEmailError("هذا البريد الإلكتروني مستخدم بالفعل");
          } else {
            toast({
              title: "خطأ في الإضافة",
              description: "فشل في إضافة المشرف الجديد",
              variant: "destructive",
            });
          }
        },
      });
    }
  };

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setAdminForm({
      name: admin.name,
      email: admin.email,
      password: "",
      confirmPassword: "",
    });
    setShowAdminDialog(true);
  };

  const handleDeleteAdmin = (adminId: number) => {
    deleteAdminMutation.mutate(adminId);
  };

  const handleToggleAdminStatus = (adminId: number) => {
    toggleAdminStatusMutation.mutate(adminId, {
      onSuccess: () => {
        toast({
          title: "تم تحديث حالة المشرف",
          description: "تم تحديث حالة المشرف بنجاح",
        });
      },
      onError: (error) => {
        toast({
          title: "خطأ في التحديث",
          description: "فشل في تحديث حالة المشرف",
          variant: "destructive",
        });
      },
    });
  };

  const resetAdminForm = () => {
    setAdminForm({ name: "", email: "", password: "", confirmPassword: "" });
    setEmailError("");
    setEditingAdmin(null);
    setShowAdminDialog(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const isAdminFormValid = (): boolean => {
    return Boolean(
      adminForm.name.trim() &&
        adminForm.email.trim() &&
        adminForm.password &&
        adminForm.confirmPassword &&
        adminForm.password === adminForm.confirmPassword &&
        adminForm.password.length >= 8 &&
        adminForm.name.trim().length >= 2 &&
        adminForm.email.includes("@")
    );
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* صلاحيات المشرفين */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3 space-x-reverse">
          <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">
              صلاحيات المشرفين
            </h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                <span className="text-blue-700 text-sm">
                  إدارة الطلبات وتتبع حالاتها
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                <span className="text-blue-700 text-sm">
                  الاطلاع على المنتجات والتصنيفات (للقراءة فقط)
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-200">
              <p className="text-sm text-gray-600 mb-2">الصلاحيات المحظورة:</p>
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
                  <span className="text-red-600 text-sm">
                    إضافة أو تعديل أو حذف المنتجات والتصنيفات
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
                  <span className="text-red-600 text-sm">
                    الاطلاع على الإحصائيات والتقارير المالية
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Management Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600 ml-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              إدارة المشرفين
            </h2>
          </div>
          <button
            onClick={() => setShowAdminDialog(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            type="button"
          >
            <UserPlus className="h-5 w-5 ml-2" />
            إضافة مشرف جديد
          </button>
        </div>

        {/* Admins List */}
        {adminsLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {admins && admins.length > 0 ? (
              admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center ml-4">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {admin.name}
                      </h3>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            admin.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {admin.is_active ? "نشط" : "غير نشط"}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          انضم في{" "}
                          {new Date(admin.created_at).toLocaleDateString(
                            "ar-EG"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => handleToggleAdminStatus(admin.id)}
                      className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                        admin.is_active
                          ? "text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          : "text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                      }`}
                      title={admin.is_active ? "إلغاء التفعيل" : "تفعيل"}
                      type="button"
                      disabled={toggleAdminStatusMutation.isPending}
                    >
                      {admin.is_active ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEditAdmin(admin)}
                      className="px-3 py-1.5 text-sm border border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                      title="تعديل"
                      type="button"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <DeleteConfirmDialog
                      adminId={admin.id}
                      adminName={admin.name}
                      adminEmail={admin.email}
                      onConfirm={() => handleDeleteAdmin(admin.id)}
                    >
                      <button
                        className="px-3 py-1.5 text-sm border border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="حذف"
                        type="button"
                        disabled={deleteAdminMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </DeleteConfirmDialog>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>لا يوجد مشرفين حالياً</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Admin Dialog */}
      {showAdminDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            dir="rtl"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAdmin ? "تعديل المشرف" : "إضافة مشرف جديد"}
            </h3>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  الاسم الكامل
                </label>
                <input
                  id="name"
                  type="text"
                  value={adminForm.name}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={2}
                  placeholder="أدخل الاسم الكامل"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => {
                    setAdminForm({ ...adminForm, email: e.target.value });
                    setEmailError(""); // مسح الخطأ عند التغيير
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    emailError 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  required
                  placeholder="أدخل البريد الإلكتروني"
                />
                {emailError && (
                  <p className="text-xs text-red-500 mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={adminForm.password}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, password: e.target.value })
                    }
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={8}
                    placeholder="أدخل كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  يجب أن تحتوي على الأقل 8 أحرف
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={adminForm.confirmPassword}
                    onChange={(e) =>
                      setAdminForm({
                        ...adminForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="أعد إدخال كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {adminForm.confirmPassword &&
                  adminForm.password !== adminForm.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      كلمات المرور غير متطابقة
                    </p>
                  )}
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                <button
                  type="button"
                  onClick={resetAdminForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={
                    createAdminMutation.isPending ||
                    updateAdminMutation.isPending ||
                    !isAdminFormValid()
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createAdminMutation.isPending ||
                  updateAdminMutation.isPending
                    ? "جاري الحفظ..."
                    : "حفظ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;