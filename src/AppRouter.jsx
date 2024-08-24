import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./login/loginPage";
import CalendarPage from "./calendar/CalendarPage";
import useAuthStore from "./hooks/useAuthStore";

export const AppRouter = () => {
    const { status, checkAuthToken } = useAuthStore();

    useEffect(() => {
        checkAuthToken();
    }, []);

    if (status === checkAuthToken) {
        return <h3>Loading...</h3>;
    }

    return (
        <Routes>
            {status === "not-authenticated" ? (
                <>
                    <Route path="/auth/*" element={<LoginPage />} />
                    <Route path="/*" element={<Navigate to="/auth/login" />} />
                </>
            ) : (
                <>
                    <Route path="/" element={<CalendarPage />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </>
            )}
        </Routes>
    );
};

export default AppRouter;
