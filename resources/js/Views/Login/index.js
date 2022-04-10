import React, {useState,useEffect} from "react";
import {Link} from "react-router-dom";
import {Formik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import {inject,observer} from "mobx-react";

const Login=(props)=>{

    const [errors,setErrors]=useState([]);

    useEffect(()=>{
        if(props.AuthStore.appState!=null){
            if(props.AuthStore.appState.isLoggedIn){
                props.history.push('/');
            }
        }
    },[]);

    const handleSubmit=(values,{setSubmitting})=>{
        axios.post('/api/auth/login',{...values})
            .then(res=>{
                if(res.data.success){
                    const userData={
                        id:res.data.id,
                        name:res.data.name,
                        email:res.data.email,
                        access_token:res.data.access_token
                    };
                    const appState={
                        isLoggedIn:true,
                        user:userData
                    };
                    props.AuthStore.saveToken(appState);
                    //props.history.push('/');
                    window.location.reload();
                }
                else {
                    alert('Giriş Yapılamadı');
                }
                setSubmitting(false);
            })
            .catch(error=>{
                if(error.response){
                    let err= error.response.data.message;
                    setErrors(err);
                }
                else if(error.request){
                    let err= error.request.data.message;
                    setErrors(err);
                }
                else{
                    let err= error.data.message;
                    setErrors(err);
                }
                setSubmitting(false);
            });
    };

    return (
        <div style={{minWidth:340, textAlign:"center"}} className={"container login-register-container"}>
            <div className="form-signin">
                <img className="mb-4 rounded-3" src="http://127.0.0.1:8000/images/everest-dagi.jpg"
                     alt="" width="72" height="72"/>
                <h1 className="h3 mb-3 font-weight-normal">Lütfen Giriş Yapın</h1>

                {errors}

                <Formik
                    initialValues={{
                        email:'',
                        password:''
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={
                        Yup.object().shape({
                            email:Yup
                                .string()
                                .email('Email Adresinizi Hatalı Girdiniz!')
                                .required('Email Adresinizi Girmek Zorundasınız!'),
                            password:Yup
                                .string()
                                .required('Şifrenizi Girmek Zorundasınız!')
                        })
                    }
                >

                    {({
                          values,
                          handleChange,
                          handleSubmit,
                          handleBlur,
                          errors,
                          isValid,
                          isSubmitting,
                          touched
                      })=>(


                        <div>
                            <input type="email" name={"email"} autoFocus={true}
                                   className="form-control mb-2 rounded-pill" placeholder="Email Adresi"
                                   value={values.email}
                                   onChange={handleChange('email')}
                                   onBlur={handleBlur}
                            />
                            {(errors.email && touched.email) && <p>{errors.email}</p>}


                            <input type="password" name={"password"}
                                   className="form-control mb-2 rounded-pill" placeholder="Şifre"
                                   value={values.password}
                                   onChange={handleChange('password')}
                                   onBlur={handleBlur}
                            />
                            {(errors.password && touched.password) && <p>{errors.password}</p>}


                            <button className="btn btn-lg btn-primary btn-block"
                                    style={{width:"100%"}} type="button"
                                    onClick={handleSubmit}
                                    disabled={!isValid || isSubmitting}
                            >Giriş Yap</button><br/>
                        </div>
                    )}
                </Formik>

                <Link className={"mt-3"} style={{display:"block"}}  to={'/register'}>Kayıt Ol</Link>
                <p className="mt-5 mb-3 text-muted">© 2021-2022</p>
            </div>
        </div>
    );
};

export default inject("AuthStore")(observer(Login));

/*
<div className="checkbox mb-3">
    <label>
        <input type="checkbox" value="remember-me"/> Beni Hatırla
    </label>
</div>
*/
