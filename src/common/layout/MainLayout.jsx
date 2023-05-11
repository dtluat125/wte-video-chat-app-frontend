import { Box, Spinner, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { validateUser } from "../../features/auth/auth.actions";
import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  const { validateError, validateSuccess, validateLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const toast = useToast();
  const history = useHistory();
  useEffect(() => {
    dispatch(validateUser());
  }, []);

  useEffect(() => {
    if (!validateLoading && validateError && !validateSuccess) {
      toast({
        status: "error",
        description: validateError,
      });
      history.replace("/login");
    }
  }, [validateLoading, validateError, validateSuccess]);

  return validateLoading ? (
    <Box w="full" h="full" flex justifyContent="center" alignItems="center">
      <Spinner />
    </Box>
  ) : (
    <>
      <Sidebar>{children}</Sidebar>
    </>
  );
}

export default MainLayout;
