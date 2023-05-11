import { useDispatch, useSelector } from "react-redux";
import LoginForm from "../../features/auth/components/LoginForm";
import "./login.scss";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageRoute } from "../../common/constants";
import { validateUser } from "../../features/auth/auth.actions";
function Login() {
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
      <LoginForm />
    </div>
  );
}

export default Login;
