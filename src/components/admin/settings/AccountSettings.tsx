import React, { useState, useEffect } from "react";
import {
  User,
  Key,
  Eye,
  EyeOff,
  Save,
  Lock,
  Mail,
  Shield,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  useAccountInfo,
  useUpdateAccount,
  useSendResetCode,
  useVerifyResetCode,
  useResetPassword,
} from "@/lib/settings_api";
interface AccountForm {
  name: string;
  email: string;
}

const AccountSettings: React.FC = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [modalStep, setModalStep] = useState<"verify" | "reset">("verify");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tempToken, setTempToken] = useState("");

  const [accountForm, setAccountForm] = useState<AccountForm>({
    name: "",
    email: "",
  });

  const { data: accountInfo, isLoading: accountLoading } = useAccountInfo();
  const updateAccountMutation = useUpdateAccount();
  const sendResetCodeMutation = useSendResetCode();
  const verifyResetCodeMutation = useVerifyResetCode();
  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    if (accountInfo && accountInfo.name && accountInfo.email) {
      setAccountForm((prev) => {
        if (
          prev.name !== accountInfo.name ||
          prev.email !== accountInfo.email
        ) {
          return {
            name: accountInfo.name || "",
            email: accountInfo.email || "",
          };
        }
        return prev;
      });
    }
  }, [accountInfo?.name, accountInfo?.email]);

  // Timer for resend code
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAccountMutation.mutate(accountForm);
  };

  const handleRequestPasswordReset = () => {
    sendResetCodeMutation.mutate(
      { email: accountForm.email },
      {
        onSuccess: () => {
          setShowPasswordModal(true);
          setModalStep("verify");
          setResendTimer(60); // 1 minute
        },
      }
    );
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    sendResetCodeMutation.mutate(
      { email: accountForm.email },
      {
        onSuccess: () => setResendTimer(60),
      }
    );
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    verifyResetCodeMutation.mutate(
      { email: accountForm.email, reset_code: resetCode },
      {
        onSuccess: (data) => {
          setTempToken(data.temp_token || "");
          setModalStep("reset");
        },
      }
    );
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword || newPassword.length < 6) return;

    resetPasswordMutation.mutate(
      { temp_token: tempToken, new_password: newPassword },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  };

  const closeModal = () => {
    setShowPasswordModal(false);
    setModalStep("verify");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
    setTempToken("");
    setResendTimer(0);
  };

  const isPasswordValid =
    newPassword.length >= 6 && newPassword === confirmPassword;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Account Information Card */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600 ml-3" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                معلومات الحساب
              </h2>
              <p className="text-sm text-gray-600">إدارة بيانات حسابك الشخصي</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {accountLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAccountSubmit} className="space-y-6">
              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    الاسم
                  </label>
                  <input
                    type="text"
                    value={accountForm.name}
                    onChange={(e) =>
                      setAccountForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="أدخل الاسم"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={accountForm.email}
                    onChange={(e) =>
                      setAccountForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="أدخل البريد الإلكتروني"
                    required
                  />
                </div>
              </div>

              {/* Display additional info as read-only */}
              {accountInfo && (
                <>
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-base font-medium text-gray-900 mb-4">
                      معلومات إضافية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500">
                          الرتبة
                        </label>
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                          {accountInfo.role === "admin"
                            ? "مدير"
                            : accountInfo.role === "owner"
                            ? "مالك"
                            : accountInfo.role === "supervisor"
                            ? "مشرف"
                            : accountInfo.role}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500">
                          حالة الحساب
                        </label>
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              accountInfo.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {accountInfo.is_active ? "نشط" : "غير نشط"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-500">
                          تاريخ الإنشاء
                        </label>
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                          {new Date(accountInfo.created_at).toLocaleDateString(
                            "ar-EG",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={updateAccountMutation.isPending}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <Save className="h-4 w-4 ml-2" />
                  {updateAccountMutation.isPending
                    ? "جاري الحفظ..."
                    : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Password Change Card */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Lock className="h-6 w-6 text-red-600 ml-3" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                تغيير كلمة المرور
              </h2>
              <p className="text-sm text-gray-600">
                تأمين حسابك بكلمة مرور جديدة
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              تغيير كلمة المرور بأمان
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              لضمان أمان حسابك، سيتم إرسال كود التحقق إلى بريدك الإلكتروني
              المسجل
            </p>
            <button
              onClick={handleRequestPasswordReset}
              disabled={sendResetCodeMutation.isPending}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Key className="h-4 w-4 ml-2" />
              {sendResetCodeMutation.isPending
                ? "جاري الإرسال..."
                : "طلب تغيير كلمة المرور"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalStep === "verify"
                  ? "تحقق من البريد الإلكتروني"
                  : "كلمة المرور الجديدة"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {modalStep === "verify" ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-blue-600 ml-2" />
                      <p className="text-sm text-blue-700">
                        تم إرسال كود التحقق إلى:{" "}
                        <span className="font-medium">{accountForm.email}</span>
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        كود التحقق
                      </label>
                      <input
                        type="text"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-lg font-mono"
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={verifyResetCodeMutation.isPending}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {verifyResetCodeMutation.isPending
                        ? "جاري التحقق..."
                        : "تحقق من الكود"}
                    </button>
                  </form>

                  <div className="text-center">
                    <button
                      onClick={handleResendCode}
                      disabled={resendTimer > 0}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {resendTimer > 0 ? (
                        <span className="flex items-center justify-center">
                          <Clock className="h-4 w-4 ml-1" />
                          إعادة الإرسال بعد {resendTimer} ثانية
                        </span>
                      ) : (
                        "إعادة إرسال الكود"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
                      <p className="text-sm text-green-700">
                        تم التحقق من الكود بنجاح. يمكنك الآن تعيين كلمة مرور
                        جديدة.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        كلمة المرور الجديدة
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="أدخل كلمة المرور الجديدة"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        يجب أن تحتوي على الأقل 6 أحرف
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        تأكيد كلمة المرور
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="أعد كتابة كلمة المرور"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-xs text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 ml-1" />
                          كلمات المرور غير متطابقة
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={
                        resetPasswordMutation.isPending || !isPasswordValid
                      }
                      className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {resetPasswordMutation.isPending
                        ? "جاري التغيير..."
                        : "تغيير كلمة المرور"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
