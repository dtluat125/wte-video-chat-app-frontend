import { Button } from "@chakra-ui/react";
import MainLayout from "../../common/layout/MainLayout";

function HomePage() {
  return (
    <MainLayout>
      HomePage
      <div>
        <Button colorScheme="blue">Home</Button>
        <Button as={Link} to={PageRoute.UPDATE_USER_PAGE} colorScheme="blue">Update User Info</Button>
      </div>
    </MainLayout>
  );
}

export default HomePage;
