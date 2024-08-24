import { useEffect } from "react";
import Swal from "sweetalert2";
import useAuthStore from "../hooks/useAuthStore";
import useForm from "../hooks/useForm";
import "./loginPage.css";

const loginFormFields = {
    loginEmail: "",
    loginPassword: "",
};

const registerFormFields = {
    registerName: "",
    registerEmail: "",
    registerPassword: "",
    registerPassword2: "",
};

const LoginPage = () => {
    const { startLogin, startRegister, errorMessage } = useAuthStore();

    const {
        loginEmail,
        loginPassword,
        onInputChange: onLoginInputChange,
    } = useForm(loginFormFields);

    const loginSubmit = (event) => {
        event.preventDefault();
        startLogin({ email: loginEmail, password: loginPassword });
    };

    const {
        registerName,
        registerEmail,
        registerPassword,
        registerPassword2,
        onInputChange: onRegisterInputChange,
    } = useForm(registerFormFields);

    const registerSubmit = (event) => {
        event.preventDefault();
        if (registerPassword !== registerPassword2) {
            Swal.fire("Register error", `Passwords don't match`, "error");
            return;
        }
        startRegister({
            username: registerName,
            email: registerEmail,
            password: registerPassword,
        });
    };

    useEffect(() => {
        if (errorMessage !== undefined) {
            Swal.fire("Authentication error", errorMessage, "error");
        }
    }, [errorMessage]);

    return (
        <div className="container login-container">
            <div className="login-card">
                <div className="login-register-forms">
                    <div className="login-form">
                        <h3>Login</h3>
                        <form onSubmit={loginSubmit}>
                            <div className="form-group mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    name="loginEmail"
                                    value={loginEmail}
                                    onChange={onLoginInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    name="loginPassword"
                                    value={loginPassword}
                                    onChange={onLoginInputChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                    <div className="register-form">
                        <h3>Register</h3>
                        <form onSubmit={registerSubmit}>
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Name"
                                    name="registerName"
                                    value={registerName}
                                    onChange={onRegisterInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    name="registerEmail"
                                    value={registerEmail}
                                    onChange={onRegisterInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    name="registerPassword"
                                    value={registerPassword}
                                    onChange={onRegisterInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Confirm Password"
                                    name="registerPassword2"
                                    value={registerPassword2}
                                    onChange={onRegisterInputChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-secondary btn-block"
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
