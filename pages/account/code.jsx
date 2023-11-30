import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { Layout } from "components/account";
import { userService, alertService } from "services";

export default Code;

function Code() {
  const router = useRouter();

  // form validation rules
  const validationSchema = Yup.object().shape({
    code: Yup.string().required("Code is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ code }) {
    alertService.clear();
    if (!userService.user.authenticate) {
      return userService
        .verifyNewFactor(
          userService.user.source.value.id,
          userService.user.source.value.factorSid,
          code
        )
        .then((data) => {
          console.log(data);
          alertService.success("Login Successful", true);
          router.push("/");
        })
        .catch(alertService.error);
    } else {
      return userService
        .createChallenge(userService.user.id, userService.user.factorSid, code)
        .then(() => {
          userService
            .update(userService.user.id, { authenticate: true })
            .then(() => {
              alertService.success("Login Successful", true);
              router.push("/");
            });
        })
        .catch(alertService.error);
    }
  }

  return (
    <Layout>
      <div className="card">
        <h4 className="card-header">Enter Code</h4>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Code</label>
              <input
                name="code"
                type="text"
                {...register("code")}
                className={`form-control ${errors.code ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.code?.message}</div>
            </div>
            <button
              disabled={formState.isSubmitting}
              className="btn btn-primary"
            >
              {formState.isSubmitting && (
                <span className="spinner-border spinner-border-sm me-1"></span>
              )}
              Authenticate
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
