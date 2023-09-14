import { Alert, AlertProps, Snackbar, SnackbarProps } from "@mui/material";
import { FC, useState } from "react";

interface Props extends SnackbarProps {
  severity?: AlertProps["severity"];
  message?: string;
}

interface UseToast {
  severity: AlertProps["severity"];
  message: string;
}

export const useToast = () => {
  const [toast, setToast] = useState<UseToast | undefined>();

  const close = () => setToast(undefined);

  return { toast, setToast, close };
};

const Toast: FC<Props> = ({ severity, message, onClose, ...rest }) => {
  return (
    <Snackbar open={!!message} autoHideDuration={4000} {...rest}>
      <Alert
        severity={severity}
        sx={{ width: "100%" }}
        onClose={(e) => {
          onClose?.(e, "clickaway");
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
