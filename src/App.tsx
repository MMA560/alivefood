// App.js (محدث مع راوت إدارة العملات)
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CheckoutFloatingBar from "./components/checkOutFloatingBar";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import ProductPage from "@/pages/ProductPage";
import SearchPage from "./pages/SearchPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import ThankYouPage from "@/pages/ThankYouPage";
import NotFound from "@/pages/NotFound";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLayout from "@/components/admin/AdminLayout";
import EditProductPage from "./pages/EditProductPage";
import ProductsList from "./components/admin/EditProduct/ProductList";
import CategoriesList from "./components/admin/Categories/CategoryList";
import CategoryView from "./components/admin/Categories/CategoryView";
import CategoryForm from "./components/admin/Categories/CategoryForm";
import { VisitorTracker } from "./hooks/useVisitorTrack";
import StatsPage from "./components/admin/stats/GeneralStats";
import PopularPages from "./components/admin/stats/PopularPages";
import GeographyPage from "./components/admin/stats/Geography";
import EventsPage from "./components/admin/stats/envents";
import AccountSettings from "./components/admin/settings/AccountSettings";
import AdminManagement from "./components/admin/settings/adminManagement";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import AboutUsPage from "./pages/AboutUsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CurrencyManagement from "./components/admin/currency/CurrencyManagement";
import HeroSliderManagement from "./components/admin/Banners/HeroSliderManagements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <VisitorTracker>
              {" "}
              {/* إضافة هنا */}
              <div className="min-h-screen flex flex-col">
                <Routes>
                  {/* Admin login route (separate) */}
                  <Route path="/admin" element={<AdminLoginPage />} />

                  {/* Admin routes with shared layout */}
                  <Route path="/admin/*" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route
                      path="products/edit/:productId?"
                      element={<EditProductPage />}
                    />
                    <Route path="products/list" element={<ProductsList />} />
                    <Route
                      path="categories/list"
                      element={<CategoriesList />}
                    />
                    <Route
                      path="categories/view/:categoryId"
                      element={<CategoryView />}
                    />
                    <Route
                      path="categories/edit/:categoryId?"
                      element={<CategoryForm />}
                    />
                    <Route path="analytics/stats" element={<StatsPage />} />
                    <Route
                      path="analytics/popular-pages"
                      element={<PopularPages />}
                    />
                    <Route
                      path="analytics/geography"
                      element={<GeographyPage />}
                    />
                    <Route path="analytics/events" element={<EventsPage />} />
                    <Route
                      path="currencies"
                      element={<CurrencyManagement />}
                    />
                    <Route
                      path="settings/account"
                      element={<AccountSettings />}
                    />
                    <Route
                      path="settings/admins"
                      element={<AdminManagement />}
                    />
                    <Route
                      path="home-offers"
                      element={<HeroSliderManagement />}
                    />
                  </Route>
                  <Route
                    path="/return-policies"
                    element={<ReturnPolicyPage />}
                  />
                  <Route path="/about-us" element={<AboutUsPage />} />
                  <Route
                    path="/terms-and-conditions"
                    element={<TermsConditionsPage />}
                  />
                  <Route
                    path="/privacy-policy"
                    element={<PrivacyPolicyPage />}
                  />

                  {/* Regular routes with header/footer */}
                  <Route
                    path="/*"
                    element={
                      <>
                        <Header />
                        <main className="flex-1">
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route
                              path="/category/:categoryId"
                              element={<CategoryPage />}
                            />
                            <Route
                              path="/product/:productId"
                              element={<ProductPage />}
                            />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route
                              path="/checkout"
                              element={<CheckoutPage />}
                            />
                            <Route
                              path="/thank-you"
                              element={<ThankYouPage />}
                            />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                        <Footer />
                        <WhatsAppButton />
                        <CheckoutFloatingBar />
                      </>
                    }
                  />
                </Routes>
              </div>
            </VisitorTracker>{" "}
            {/* إغلاق هنا */}
          </BrowserRouter>
        </CartProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;