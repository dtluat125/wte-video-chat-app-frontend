import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../common/layout/MainLayout";
import { updateUser } from "../../features/auth/auth.actions";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { PageRoute } from "../../common/constants";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";

function UpdateInfoPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { userInfo, loading, error } = useSelector((state) => state.auth);
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
  
    useEffect(() => {
      if (!userInfo) {
        history.replace(PageRoute.LOGIN_PAGE);
      }
    }, [userInfo, history]);
  
    const handleUpdate = () => {
      dispatch(
        updateUser({
          name,
          email,
        })
      );
    };
  
    return (
      <MainLayout>
        <Box maxW="md" mx="auto" mt="8">
          <FormControl id="name" mb="4">
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl id="email" mb="4">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          <Button colorScheme="blue" onClick={handleUpdate}>
            Update
          </Button>
        </Box>
      </MainLayout>
    );
  }
  
  export default UpdateInfoPage;