import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import store from "./store/store";

export const CalendarApp = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </Provider>
    );
};
