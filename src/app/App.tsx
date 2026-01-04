import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { OnboardingPage } from '@/pages/auth/OnboardingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { BrokerLoginPage } from '@/pages/auth/BrokerLoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { RegisterCompanyPage } from '@/pages/auth/RegisterCompanyPage';
import { PropertiesPage } from '@/pages/properties/PropertiesPage';
import { PropertyDetailPage } from '@/pages/properties/PropertyDetailPage';
import { NewPropertyPage } from '@/pages/properties/NewPropertyPage';
import { VirtualTourPage } from '@/pages/properties/VirtualTourPage';
import { CatalogsPage } from '@/pages/catalogs/CatalogsPage';
import { CatalogDetailPage } from '@/pages/catalogs/CatalogDetailPage';
import { CartPage } from '@/pages/cart/CartPage';
import { QuotesPage } from '@/pages/quotes/QuotesPage';
import { AnalyticsPage } from '@/pages/analytics/AnalyticsPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { AccountPage } from '@/pages/account/AccountPage';
import { PlansPage } from '@/pages/plans/PlansPage';
import { useAuthStore } from '@/stores/useAuthStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export function App() {
  return (
    <Routes>
      {/* Public Routes - Without Layout */}
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/broker-login" element={<BrokerLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-company" element={<RegisterCompanyPage />} />

      {/* Private Routes - With Layout */}
      <Route element={<AppLayout />}>
        <Route
          path="/properties"
          element={
            <PrivateRoute>
              <PropertiesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/properties/new"
          element={
            <PrivateRoute>
              <NewPropertyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/properties/:id"
          element={
            <PrivateRoute>
              <PropertyDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/properties/:id/virtual-tour"
          element={
            <PrivateRoute>
              <VirtualTourPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/virtual-tour"
          element={
            <PrivateRoute>
              <VirtualTourPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/catalogs"
          element={
            <PrivateRoute>
              <CatalogsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/catalogs/:id"
          element={
            <PrivateRoute>
              <CatalogDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/quotes"
          element={
            <PrivateRoute>
              <QuotesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <AnalyticsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics/reports"
          element={
            <PrivateRoute>
              <AnalyticsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <AccountPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <PrivateRoute>
              <PlansPage />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
