import { useDispatch, useSelector } from "react-redux";
import SignupForm from "../../features/auth/components/SignupForm";
import "./signup.scss";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageRoute } from "../../common/constants";
import { validateUser } from "../../features/auth/auth.actions";
function Signup() {
  const { validateSuccess, validateLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(validateUser());
  }, []);

  useEffect(() => {
    if (validateSuccess && !validateLoading)
      history.replace(PageRoute.HOME_PAGE);
  }, [validateLoading, validateSuccess]);
  return (
    <div className="login-form-container">
      <SignupForm />
    </div>
  );
}

export default Signup;
