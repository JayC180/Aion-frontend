import { useDispatch, useSelector } from "react-redux";
import api from "../api";
import {
    clearErrorMessage,
    onChecking,
    onLogin,
    onLogout,
} from "../store/authSlice";
import { onLogoutCalendar } from "../store/calendarSlice";

export const useAuthStore = () => {
    const { status, user, errorMessage } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({ email, password }) => {
        dispatch(onChecking());

        try {
            const { data } = await api.post("/auth/login", { email, password });

            localStorage.setItem("token", data.token);
            localStorage.setItem("token-init-date", new Date().getTime());

            dispatch(onLogin({ username: data.username, uid: data.uid }));
        } catch (error) {
            dispatch(onLogout("Wrong credentials"));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    };

    const startRegister = async ({ username, email, password }) => {
        dispatch(onChecking());
        try {
            const { data } = await api.post("/auth/register", {
                username,
                email,
                password,
            });
            localStorage.setItem("token", data.token);
            localStorage.setItem("token-init-date", new Date().getTime());
            dispatch(onLogin({ username: data.username, uid: data.uid }));
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg || "Registration failed";
            dispatch(onLogout(errorMessage));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    };

    const checkAuthToken = async () => {
        const token = localStorage.getItem("token");

        if (!token) return dispatch(onLogout());

        try {
            const { data } = await api.get("/auth/renew");

            localStorage.setItem("token", data.token);
            localStorage.setItem("token-init-date", new Date().getTime());

            dispatch(onLogin({ username: data.username, uid: data.uid }));
        } catch (error) {
            localStorage.clear();
            dispatch(onLogout());
        }
    };

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout());
        dispatch(onLogoutCalendar());
    };

    return {
        errorMessage,
        status,
        user,
        checkAuthToken,
        startLogin,
        startLogout,
        startRegister,
    };
};

export default useAuthStore;
