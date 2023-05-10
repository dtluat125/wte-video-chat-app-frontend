import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import { validateUser } from "../../features/auth/auth.actions";
import { Box, Spinner, useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

function MainLayout({ children }) {
  const { error, success, loading, userInfo } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const toast = useToast();
  const history = useHistory();
  useEffect(() => {
    console.log("validate");
    dispatch(validateUser());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && error && !success) {
      toast({
        status: "error",
        description: error,
      });
      history.replace("/login");
    }
  }, [success, loading, toast, error, history]);

  return loading ? (
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
