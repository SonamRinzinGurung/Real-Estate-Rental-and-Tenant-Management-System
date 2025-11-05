import { toast } from "react-toastify"
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Custom hook to show toast notifications based on alert flags and types
export default function useToast({
    alertFlag,
    alertType,
    message,
    clearAlertAction,
    autoClose = 3500,
    toastOptions = {},
}) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!alertFlag) return;

        const options = { autoClose, ...toastOptions };

        switch (alertType) {
            case "success":
                toast.success(message, options);
                break;
            case "error":
                toast.error(message, options);
                break;
            case "info":
                toast.info(message, options);
                break;
            case "warning":
                toast.warning(message, options);
                break;
            default:
                toast(message, options);
        }

        const timer = setTimeout(() => {
            if (typeof clearAlertAction === "function") {
                dispatch(clearAlertAction());
            }
        }, autoClose);

        return () => clearTimeout(timer);
    }, [alertFlag, alertType, message, clearAlertAction, autoClose, toastOptions, dispatch]);

    return null;
}