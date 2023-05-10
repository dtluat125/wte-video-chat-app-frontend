import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
  FormErrorMessage,
} from "@chakra-ui/react";
import { forwardRef, useRef } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import PropTypes from "prop-types";

export const PasswordField = forwardRef((props, ref) => {
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef(null);
  const mergeRef = useMergeRefs(inputRef, ref);
  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({
        preventScroll: true,
      });
    }
  };
  const { register, watch, ...restProps } = props;
  return (
    <FormControl isInvalid={!!props.error}>
      <FormLabel htmlFor={props.id || "password"}>
        {props.label || "Password"}
      </FormLabel>
      <InputGroup>
        <InputRightElement>
          <IconButton
            variant="link"
            aria-label={isOpen ? "Mask password" : "Reveal password"}
            icon={isOpen ? <HiEyeOff /> : <HiEye />}
            onClick={onClickReveal}
          />
        </InputRightElement>
        <Input
          id={props.id || "password"}
          ref={mergeRef}
          name="password"
          type={isOpen ? "text" : "password"}
          autoComplete="current-password"
          {...(register
            ? register(props.name || "password", {
                required: "This field is required",
                validate: (val) => {
                  if (props.name !== "passwordConfirm") return true;
                  if (watch && watch("password") != val) {
                    return "Your passwords do no match";
                  }
                },
              })
            : {})}
          {...restProps}
        />
      </InputGroup>
      <FormErrorMessage>{props.error || ""}</FormErrorMessage>
    </FormControl>
  );
});

PasswordField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  name: PropTypes.string,
  register: PropTypes.any,
  watch: PropTypes.any,
};
PasswordField.displayName = "PasswordField";
