import { createBrowserRouter, Outlet } from "react-router-dom";
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

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ThemeProvider theme={theme}>
                <ScrollToTop />
                <Outlet />
            </ThemeProvider>
        ),
        children: [
            {
                path: "owner",
                element: (
                    <ProtectedRoutes source={"owner"}>
                        <SharedLayout />
                    </ProtectedRoutes>
                ),
                children: [
                    { index: true, element: <HomepageOwner /> },
                    { path: "property/post", element: <PostRealEstate /> },
                    { path: "real-estate/:slug", element: <PersonalRealEstateDetail /> },
                    {
                        path: "real-estate/update/:slug",
                        element: <UpdateRealEstateDetail />,
                    },
                    { path: "profile", element: <ProfilePageOwner /> },
                    { path: "tenant-user/:slug", element: <TenantUserDetailPage /> },
                    { path: "contacts/all", element: <AllContacts /> },
                    { path: "contract/create", element: <CreateContractPage /> },
                    {
                        path: "contract/:realEstateId/:slug",
                        element: <ContractDetailPage />,
                    },
                    { path: "rentDetail", element: <AllRentDetailPage /> },
                    { path: "rentDetail/create", element: <CreateRentDetail /> },
                    {
                        path: "rentDetail/:rentDetailId/:slug",
                        element: <SingleRentDetail />,
                    },
                    {
                        path: "rentDetail/send-payment-email/:rentDetailId",
                        element: <SendPaymentEmailPage />,
                    },
                    {
                        path: "rentDetail/paymentHistory/:rentDetailId/create",
                        element: <CreatePaymentHistory />,
                    },
                    { path: "chat", element: <OwnerChat /> },
                ],
            },
            {
                path: "tenant",
                element: (
                    <ProtectedRoutes source={"tenant"}>
                        <SharedLayout />
                    </ProtectedRoutes>
                ),
                children: [
                    { index: true, element: <HomepageTenant /> },
                    { path: "real-estate/:slug", element: <RealEstateDetail /> },
                    { path: "real-estate/saved/all", element: <SavedRealEstate /> },
                    { path: "profile", element: <ProfilePageTenant /> },
                    { path: "owner-user/:slug", element: <OwnerUserDetailPage /> },
                    {
                        path: "contract-agreement/:contractId",
                        element: <ContractAgreementPage />,
                    },
                    { path: "rental-properties/all", element: <AllRentalProperties /> },
                    {
                        path: "rental-properties/:slug",
                        element: <RentalPropertyDetail />,
                    },
                    {
                        path: "contract/:realEstateId/:slug",
                        element: <ContractDetailPageTenant />,
                    },
                    {
                        path: "rentDetail/:realEstateId/:slug",
                        element: <RentDetailTenantPage />,
                    },
                    { path: "send-complaint/:slug", element: <SendComplaint /> },
                    { path: "contacts/all", element: <AllContactsTenant /> },
                    { path: "chat", element: <TenantChat /> },
                ],
            },
            { path: "/login/:role", element: <Login /> },
            { path: "/register/:role", element: <Register /> },
            { path: "/forgot-password/:role", element: <ForgotPassword /> },
            { path: "/reset-password/:role/:token", element: <ResetPassword /> },
            { path: "/account-created/:role", element: <VerificationMessagePage /> },
            { path: "/verify-account/:role/:token", element: <VerifyEmailPage /> },
            { path: "/", index: true, element: <Landing /> },
            { path: "/about", element: <AboutPage /> },
            { path: "/privacy", element: <PrivacyPoliciesPage /> },
            { path: "*", element: <NotFound /> },
        ],
    },
]);

export default router;
