import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Link,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Regex } from "../../../common/constants";
import { loginUser } from "../auth.actions";
import { Logo } from "./Logo";
import { PasswordField } from "./PasswordField";

export default function LoginForm() {
  const { loading, success, error, userToken } = useSelector(
    (state) => state.auth
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  const history = useHistory();

  const submitForm = (data) => {
    console.log(data);
    dispatch(loginUser(data));
  };

  const toast = useToast();

  useEffect(() => {
    if (!loading && success && userToken) {
      history.replace("/");
      toast({
        status: "success",
        description: "Logged in successfully",
      });
      console.log(userToken);
      if (userToken) {
        localStorage.setItem("jwt", userToken);
      }
    } else if (!loading && error) {
      toast({
        status: "error",
        description: error,
      });
    }
  }, [success, error, loading, toast]);
  return (
    <Container
      maxW="lg"
      py={{
        base: "12",
        md: "24",
      }}
      px={{
        base: "0",
        sm: "8",
      }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Logo />
          <Stack
            spacing={{
              base: "2",
              md: "3",
            }}
            textAlign="center"
          >
            <Heading
              size={{
                base: "xs",
                md: "sm",
              }}
            >
              Log in to your account
            </Heading>
            <HStack spacing="1" justify="center">
              <Text color="muted">Dont have an account?</Text>
              <Link variant="link" colorScheme="blue" href="signup">
                Sign up
              </Link>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{
            base: "0",
            sm: "8",
          }}
          px={{
            base: "4",
            sm: "10",
          }}
          bg={{
            base: "transparent",
            sm: "white",
          }}
          boxShadow={{
            base: "none",
            sm: "md",
          }}
          borderRadius={{
            base: "none",
            sm: "xl",
          }}
        >
          <form onSubmit={handleSubmit(submitForm)}>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl isInvalid={errors.email}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    {...register("email", {
                      required: "This field is required",
                      pattern: {
                        value: Regex.EMAIL,
                        message: "Email is invalid",
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>
                <PasswordField
                  error={errors.password && errors.password.message}
                  register={register}
                />
              </Stack>
              <HStack justify="space-between">
                <div />
                <Button variant="link" colorScheme="blue" size="sm">
                  Forgot password?
                </Button>
              </HStack>
              <Stack spacing="6">
                <Button
                  variant="solid"
                  colorScheme="blue"
                  isLoading={loading}
                  type="submit"
                >
                  {loading ? <Spinner /> : " Sign in"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
}
