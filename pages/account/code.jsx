import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Layout } from 'components/account';
import { userService, alertService } from 'services';

export default Code;

function Code() {
 const router = useRouter();

 // form validation rules
 const validationSchema = Yup.object().shape({
  code: Yup.string().required('Code is required'),
 });
 const formOptions = { resolver: yupResolver(validationSchema) };

 // get functions to build form with useForm() hook
 const { register, handleSubmit, formState } = useForm(formOptions);
 const { errors } = formState;

//  console.log('code', userService.userValue);

 function onSubmit({ code }) {
  alertService.clear();
  if (!userService.userValue.user.authenticated) {
   return userService
    .verifyNewFactor(userService.userValue.user.id, code)
    .then((data) => {
    //  console.log(data);
     userService
      .update(userService.userValue.user.id, { authenticated: true })
      .then((data) => {
       if (data.status === 'verified') {
        alertService.success('Login Successful', true);
        router.push('/');
       } else {
        alertService.error('Login Failed, Code Incorrect', false);
       }
      });
    })
    .catch(alertService.error);
  } else {
   return userService
    .createChallenge(
     userService.userValue.user.id,
     userService.userValue.user.factorSid,
     code
    )
    .then((data) => {
     if (data.status === 'approved') {
      alertService.success('Login Successful', true);
      router.push('/');
     } else {
      alertService.error('Login Failed, Code Incorrect', false);
     }
    })
    .catch(alertService.error);
  }
 }

 return (
  <Layout>
   <div className='card'>
    <h4 className='card-header'>Enter Code</h4>
    <div className='card-body'>
     <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-3'>
       <label className='form-label'>Code</label>
       <input
        name='code'
        type='text'
        {...register('code')}
        className={`form-control ${errors.code ? 'is-invalid' : ''}`}
       />
       <div className='invalid-feedback'>{errors.code?.message}</div>
      </div>
      <button disabled={formState.isSubmitting} className='btn btn-primary'>
       {formState.isSubmitting && (
        <span className='spinner-border spinner-border-sm me-1'></span>
       )}
       Authenticate
      </button>
     </form>
    </div>
   </div>
  </Layout>
 );
}
