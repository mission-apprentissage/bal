import type { AlertProps, SnackbarProps } from "@mui/material";
import { Alert, Snackbar } from "@mui/material";
import type { FC } from "react";
import { useState } from "react";

interface Props extends SnackbarProps {
  severity?: AlertProps["severity"];
  message?: string;
  handleClose?: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

interface UseToast {
  severity: AlertProps["severity"];
  message: string;
}

export const useToast = () => {
  const [toast, setToast] = useState<UseToast | undefined>();

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(undefined);
  };

  return { toast, setToast, handleClose };
};

const Toast: FC<Props> = ({ severity, message, handleClose, ...rest }) => {
  return (
    <Snackbar open={!!message} autoHideDuration={4000} onClose={handleClose} {...rest}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
