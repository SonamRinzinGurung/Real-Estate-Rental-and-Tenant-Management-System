import { HashRouter as Router, Routes, Route } from "react-router-dom";
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
    OwnerChat,
    TenantChat,
} from "./pages";
import {
    SharedLayout,
    ProtectedRoutes,
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
            <Router>
                <ScrollToTop /> {/*Scroll to top when route changes*/}
                <Routes>
                    <Route
                        path="/owner"
                        element={
                            <ProtectedRoutes source={"owner"}>
                                <SharedLayout />
                            </ProtectedRoutes>
                        }
                    >
                        <Route index element={<HomepageOwner />} />
                        <Route path="property/post" element={<PostRealEstate />} />
                        <Route
                            path="real-estate/:slug"
                            element={<PersonalRealEstateDetail />}
                        />
                        <Route
                            path="real-estate/update/:slug"
                            element={<UpdateRealEstateDetail />}
                        />
                        <Route path="profile" element={<ProfilePageOwner />} />
                        <Route
                            path="tenant-user/:slug"
                            element={<TenantUserDetailPage />}
                        />
                        <Route path="contacts/all" element={<AllContacts />} />
                        <Route path="contract/create" element={<CreateContractPage />} />
                        <Route
                            path="contract/:realEstateId/:slug"
                            element={<ContractDetailPage />}
                        />
                        <Route path="rentDetail" element={<AllRentDetailPage />} />
                        <Route path="rentDetail/create" element={<CreateRentDetail />} />
                        <Route
                            path="rentDetail/:rentDetailId/:slug"
                            element={<SingleRentDetail />}
                        />
                        <Route
                            path="rentDetail/send-payment-email/:rentDetailId"
                            element={<SendPaymentEmailPage />}
                        />
                        <Route
                            path="rentDetail/paymentHistory/:rentDetailId/create"
                            element={<CreatePaymentHistory />}
                        />
                        <Route path="chat" element={<OwnerChat />} />
                    </Route>
                    <Route
                        path="/tenant"
                        element={
                            <ProtectedRoutes source={"tenant"}>
                                <SharedLayout />
                            </ProtectedRoutes>
                        }
                    >
                        <Route index element={<HomepageTenant />} />
                        <Route path="real-estate/:slug" element={<RealEstateDetail />} />
                        <Route path="real-estate/saved/all" element={<SavedRealEstate />} />
                        <Route path="profile" element={<ProfilePageTenant />} />
                        <Route path="owner-user/:slug" element={<OwnerUserDetailPage />} />
                        <Route
                            path="contract-agreement/:contractId"
                            element={<ContractAgreementPage />}
                        />
                        <Route
                            path="rental-properties/all"
                            element={<AllRentalProperties />}
                        />
                        <Route
                            path="rental-properties/:slug"
                            element={<RentalPropertyDetail />}
                        />
                        <Route
                            path="contract/:realEstateId/:slug"
                            element={<ContractDetailPageTenant />}
                        />
                        <Route
                            path="rentDetail/:realEstateId/:slug"
                            element={<RentDetailTenantPage />}
                        />
                        <Route path="send-complaint/:slug" element={<SendComplaint />} />
                        <Route path="contacts/all" element={<AllContactsTenant />} />
                        <Route path="chat" element={<TenantChat />} />
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
                    <Route index element={<Landing />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="privacy" element={<PrivacyPoliciesPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
