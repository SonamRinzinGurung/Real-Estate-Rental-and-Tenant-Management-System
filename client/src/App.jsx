import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  HomepageOwner,
  HomepageTenant,
  Landing,
  AboutPage,
  PrivacyPoliciesPage,
  NotFound,
  PostRealEstate,
  RealEstateDetail,
  PersonalRealEstateDetail,
  SavedRealEstate,
  ProfilePageTenant,
  ProfilePageOwner,
  OwnerUserDetailPage,
  TenantUserDetailPage,
  UpdateRealEstateDetail,
  AllContacts,
  CreateContractPage,
  ContractAgreementPage,
  ContractDetailPage,
  AllRentDetailPage,
  CreateRentDetail,
  SingleRentDetail,
  AllRentalProperties,
  RentalPropertyDetail,
  ContractDetailPageTenant,
  SendPaymentEmailPage,
  CreatePaymentHistory,
  RentDetailTenantPage,
  SendComplaint,
  VerifyEmailPage,
  VerificationMessagePage,
  AllContactsTenant,
} from "./pages";
import {
  SharedLayoutOwner,
  SharedLayoutTenant,
  ProtectedRoutesOwner,
  ProtectedRoutesTenant,
  ScrollToTop,
} from "./components";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ada2ff",
    },
    secondary: {
      main: "#EE9B01",
    },
    tertiary: {
      main: "#00ACCF",
      dark: "#0496b4",
    },

    tonalOffset: 0.2,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ScrollToTop /> {/*Scroll to top when route changes*/}
        <Routes>
          <Route
            path="/owner"
            element={
              <ProtectedRoutesOwner>
                <SharedLayoutOwner />
              </ProtectedRoutesOwner>
            }
          >
            <Route index element={<HomepageOwner />} />
            <Route path="/owner/property/post" element={<PostRealEstate />} />
            <Route
              path="/owner/real-estate/:slug"
              element={<PersonalRealEstateDetail />}
            />
            <Route
              path="/owner/real-estate/update/:slug"
              element={<UpdateRealEstateDetail />}
            />
            <Route path="/owner/profile" element={<ProfilePageOwner />} />
            <Route
              path="/owner/tenant-user/:slug"
              element={<TenantUserDetailPage />}
            />
            <Route path="/owner/contacts/all" element={<AllContacts />} />
            <Route
              path="/owner/contract/create"
              element={<CreateContractPage />}
            />
            <Route
              path="/owner/contract/:realEstateId/:slug"
              element={<ContractDetailPage />}
            />
            <Route path="/owner/rentDetail" element={<AllRentDetailPage />} />
            <Route
              path="/owner/rentDetail/create"
              element={<CreateRentDetail />}
            />
            <Route
              path="/owner/rentDetail/:rentDetailId/:slug"
              element={<SingleRentDetail />}
            />
            <Route
              path="/owner/rentDetail/send-payment-email/:rentDetailId"
              element={<SendPaymentEmailPage />}
            />
            <Route
              path="/owner/rentDetail/paymentHistory/:rentDetailId/create"
              element={<CreatePaymentHistory />}
            />
          </Route>
          <Route
            path="/tenant"
            element={
              <ProtectedRoutesTenant>
                <SharedLayoutTenant />
              </ProtectedRoutesTenant>
            }
          >
            <Route index element={<HomepageTenant />} />
            <Route
              path="/tenant/real-estate/:slug"
              element={<RealEstateDetail />}
            />
            <Route
              path="/tenant/real-estate/saved/all"
              element={<SavedRealEstate />}
            />
            <Route path="/tenant/profile" element={<ProfilePageTenant />} />
            <Route
              path="/tenant/owner-user/:slug"
              element={<OwnerUserDetailPage />}
            />
            <Route
              path="/tenant/contract-agreement/:contractId"
              element={<ContractAgreementPage />}
            />
            <Route
              path="/tenant/rental-properties/all"
              element={<AllRentalProperties />}
            />
            <Route
              path="/tenant/rental-properties/:slug"
              element={<RentalPropertyDetail />}
            />
            <Route
              path="/tenant/contract/:realEstateId/:slug"
              element={<ContractDetailPageTenant />}
            />
            <Route
              path="/tenant/rentDetail/:realEstateId/:slug"
              element={<RentDetailTenantPage />}
            />
            <Route
              path="/tenant/send-complaint/:slug"
              element={<SendComplaint />}
            />
            <Route
              path="/tenant/contacts/all"
              element={<AllContactsTenant />}
            />
          </Route>
          <Route path="/login/:role" element={<Login />} />
          <Route path="/register/:role" element={<Register />} />
          <Route path="/forgot-password/:role" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:role/:token"
            element={<ResetPassword />}
          />
          <Route
            path="/account-created/:role"
            element={<VerificationMessagePage />}
          />
          <Route
            path="/verify-account/:role/:token"
            element={<VerifyEmailPage />}
          />
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPoliciesPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
