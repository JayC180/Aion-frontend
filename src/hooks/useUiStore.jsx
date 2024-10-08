import { useDispatch, useSelector } from "react-redux";
import { onCloseDateModal, onOpenDateModal } from "../store/uiSlice";

export const useUiStore = () => {
    const dispatch = useDispatch();

    const { isDateModalOpen } = useSelector((state) => state.ui);

    const openDateModal = () => {
        dispatch(onOpenDateModal());
    };

    const closeDateModal = () => {
        dispatch(onCloseDateModal());
    };

    const toggleDateModal = () => {
        isDateModalOpen ? openDateModal() : closeDateModal();
    };

    return {
        isDateModalOpen,
        closeDateModal,
        openDateModal,
        toggleDateModal,
    };
};

export default useUiStore;
