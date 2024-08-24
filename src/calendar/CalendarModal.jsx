import { useMemo, useState, useEffect } from "react";
import { addHours, differenceInSeconds } from "date-fns";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import Modal from "react-modal";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import en_us from "date-fns/locale/en-US";
import useCalendarStore from "../hooks/useCalendarStore";
import useUiStore from "../hooks/useUiStore";

registerLocale("us", en_us);

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

Modal.setAppElement("#root");

export const CalendarModal = () => {
    const { isDateModalOpen, closeDateModal } = useUiStore();
    const { activeEvent, startSavingEvent } = useCalendarStore();

    const [formSubmitted, setFormSubmitted] = useState(false);

    const [formValues, setFormValues] = useState({
        title: "",
        description: "",
        begin: new Date(),
        end: addHours(new Date(), 2),
    });

    const titleClass = useMemo(() => {
        if (!formSubmitted) return "";

        return formValues.title.length > 0 ? "" : "is-invalid";
    }, [formValues.title, formSubmitted]);

    useEffect(() => {
        if (activeEvent !== null) {
            setFormValues({ ...activeEvent });
        }
    }, [activeEvent]);

    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value,
        });
    };

    const onDateChanged = (event, changing) => {
        setFormValues({
            ...formValues,
            [changing]: event,
        });
    };

    const onCloseModal = () => {
        closeDateModal();
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true);

        const difference = differenceInSeconds(
            formValues.end,
            formValues.begin
        );

        if (isNaN(difference) || difference <= 0) {
            Swal.fire("Dates invalid", "error");
            return;
        }

        if (formValues.title.length <= 0) return;

        await startSavingEvent(formValues);
        closeDateModal();
        setFormSubmitted(false);
    };

    return (
        <Modal
            isOpen={isDateModalOpen}
            onRequestClose={onCloseModal}
            style={customStyles}
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <h1> New Event </h1>
            <hr />
            <form className="container" onSubmit={onSubmit}>
                <div className="form-group mb-2">
                    <label>Start date and time</label>
                    <DatePicker
                        selected={formValues.begin}
                        onChange={(event) => onDateChanged(event, "begin")}
                        className="form-control"
                        dateFormat="Pp"
                        showTimeSelect
                        locale="us"
                        timeCaption="Time"
                    />
                </div>

                <div className="form-group mb-2">
                    <label>End date and time</label>
                    <DatePicker
                        minDate={formValues.begin}
                        selected={formValues.end}
                        onChange={(event) => onDateChanged(event, "end")}
                        className="form-control"
                        dateFormat="Pp"
                        showTimeSelect
                        locale="us"
                        timeCaption="Time"
                    />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Event Title</label>
                    <input
                        type="text"
                        className={`form-control ${titleClass}`}
                        placeholder="Event Title"
                        name="title"
                        autoComplete="off"
                        value={formValues.title}
                        onChange={onInputChanged}
                    />
                    <small id="emailHelp" className="form-text text-muted">
                        Description
                    </small>
                </div>

                <div className="form-group mb-2">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Description"
                        rows="5"
                        name="description"
                        value={formValues.description}
                        onChange={onInputChanged}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Save </span>
                </button>
            </form>
        </Modal>
    );
};

export default CalendarModal;
