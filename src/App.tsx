import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useAuthStore } from "./stores/useAuthStore";
import WallRoll from "./pages/WallRollPage";
// Layout Components (loaded eagerly as they are almost always needed)
import Layout from "./components/Layout/Layout";
import AdminLayout from "./components/Layout/AdminLayout";
import RequireAdmin from "./components/Layout/RequireAdmin";
import WallRollDetail from "./pages/WallRollDetail";
import UploadProductImagePage from "./pages/Admin/UploadProductImagePage";
import { Upload } from "lucide-react";
// Lazy load all page-level components
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const WallArtPage = lazy(() => import("./pages/WallArtPage"));
const WallArtDetail = lazy(() => import("./pages/WallArtDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Checkout = lazy(() => import("./pages/Checkout"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CustomDesign = lazy(() => import("./pages/CustomDesign"));
const About = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Bestsellers = lazy(() => import("./pages/Bestsellers"));

// Lazy load Admin pages
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const AdminIndex = lazy(() => import("./pages/Admin"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AddProduct = lazy(() => import("./pages/Admin/AddProduct"));
const EditProduct = lazy(() => import("./pages/Admin/EditProduct"));
const AbandonedCarts = lazy(() => import("./pages/Admin/AbandonedCarts"));
const ProductInsights = lazy(() => import("./pages/Admin/ProductInsights"));
const ProductArrangement = lazy(
  () => import("./pages/Admin/ProductArrangement")
);
const MediaManagement = lazy(() => import("./pages/Admin/MediaManagement"));
const UserAccessControl = lazy(() => import("./pages/Admin/UserAccessControl"));
const AnalyticsDashboard = lazy(
  () => import("./pages/Admin/AnalyticsDashboard")
);

// A simple loading component for the fallback
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    Loading...
  </div>
);

function App() {
  useEffect(() => {
    useAuthStore.getState().fetchSession();
  }, []);

  return (
    <HelmetProvider>
      <Router>
        {/* Wrap all routes in a Suspense component */}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Main Application Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="wallpapers" element={<Products />} />
              <Route path="Wallpaper/:id" element={<ProductDetail />} />
              <Route path="wallart" element={<WallArtPage />} />
              <Route path="wall-art/:id" element={<WallArtDetail />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="custom-design" element={<CustomDesign />} />
              <Route path="about" element={<About />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="bestsellers" element={<Bestsellers />} />
              <Route path="*" element={<NotFound />} />
              <Route path="wallroll" element={<WallRoll />}/>
              <Route path="Wallpaper-Roll/:id" element={<WallRollDetail />}/>
            </Route>

            {/* Standalone pages (no main layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<AdminIndex />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="abandoned-carts" element={<AbandonedCarts />} />
              <Route path="insights" element={<ProductInsights />} />
              <Route path="arrange" element={<ProductArrangement />} />
              <Route path="uploadimg" element={<UploadProductImagePage />} />
              <Route path="access" element={<UserAccessControl />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
