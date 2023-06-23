import { Box, Spinner, useToast } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../../plugins/socket/SocketProvider";
import { setIsSocketConnected } from "../../features/auth/auth.reducer";
import { validateUser } from "../../features/auth/auth.actions";

const withUserValidation = (WrappedComponent) => {
  const WithUserValidation = (props) => {
    const { validateSuccess, validateLoading } = useSelector(
      (state) => state.auth
    );
    const dispatch = useDispatch();
    const toast = useToast();
    const history = useHistory();
    const socketService = useContext(SocketContext);

    useEffect(() => {
      if (!socketService) return;
      dispatch(validateUser())
        .unwrap()
        .then(() => {
          if (!socketService?.socket?.connected) socketService.connect();
          dispatch(setIsSocketConnected(true));
        })
        .catch((err) => {
          toast({
            status: "error",
            description: err,
          });
          history.replace("/login");
        });
    }, [socketService]);

    if (validateLoading) {
      // Show loading state if still validating user
      return (
        <Box w="full" h="full" flex justifyContent="center" alignItems="center">
          <Spinner />
        </Box>
      );
    }

    if (validateSuccess) {
      // Render the wrapped component if user is valid
      return <WrappedComponent {...props} />;
    }

    // Render alternative content or redirect to a login page if user is not valid
    return <div>Unauthorized. Please log in.</div>;
  };

  return WithUserValidation;
};

export default withUserValidation;
