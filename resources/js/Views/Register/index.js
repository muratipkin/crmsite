import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Formik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import {inject,observer} from "mobx-react";

const Register=(props)=>{

    const [errors,setErrors]=useState([]);

    useEffect(()=>{
        if(props.AuthStore.appState!=null){
            if(props.AuthStore.appState.isLoggedIn){
                props.history.push('/');
            }
        }
    },[]);

    const handleSubmit=(values)=>{
        axios.post('/api/auth/register',{...values})
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
                    props.history.push('/');
                    alert('Kayıt İşlemi Tamamlandı');
                }
                else {
                    alert('Giriş Yapılamadı');
                }
            })
            .catch(error=>{
                if(error.response){
                    let err= error.response.data.message;
                    setErrors(err);
                    //alert(err);
                }
                else if(error.request){
                    let err= error.request.data.message;
                    setErrors(err);
                    //alert(err);
                }
                else{
                    let err= error.data.message;
                    setErrors(err);
                    //alert(err);
                }
            });
    };

    return (
        <div style={{minWidth:340, textAlign:"center"}} className={"container login-register-container"}>
        <div className="form-signin">
            <img className="mb-4 rounded-3" src="http://127.0.0.1:8000/images/everest-dagi.jpg" alt="" width="72" height="72"/>
            <h1 className="h3 mb-3 font-weight-normal">Lütfen Kayıt Olun</h1>

            {errors}

            <Formik
                initialValues={{
                    name:'',
                    email:'',
                    password:'',
                    password_confirmation:''
                }}
                onSubmit={handleSubmit}
                validationSchema={
                    Yup.object().shape({
                        email:Yup
                            .string()
                            .email('Email Adresinizi Hatalı Girdiniz!')
                            .required('Email Adresinizi Girmek Zorundasınız!'),
                        name:Yup
                            .string()
                            .required('Adınızı ve Soyadınızı Girmek Zorundasınız!'),
                        password:Yup
                            .string()
                            .required('Şifrenizi Girmek Zorundasınız!'),
                        password_confirmation:Yup
                            .string()
                            .oneOf([Yup.ref('password'),null],'Şifreler Eşleşmiyor!')
                            .required('Şifrenizi Tekrar Girmek Zorundasınız!')
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
                {//<label htmlFor="inputNameSurname" className="sr-only">Ad Soyad</label>
                }
                <input type="text" name={"name"}
                       className="form-control mb-2 rounded-pill" placeholder="Ad Soyad" autoFocus={true}
                       value={values.name}
                       onChange={handleChange('name')}
                       onBlur={handleBlur}
                />
                {(errors.name && touched.name) && <p>{errors.name}</p>}


                {//<label htmlFor="inputEmail" className="sr-only">Email Adresi</label>
                }
                <input type="email" name={"email"}
                       className="form-control mb-2 rounded-pill" placeholder="Email Adresi"
                       value={values.email}
                       onChange={handleChange('email')}
                       onBlur={handleBlur}
                />
                {(errors.email && touched.email) && <p>{errors.email}</p>}


                {//<label htmlFor="inputPassword" className="sr-only">Şifre</label>
                }
                <input type="password" name={"password"}
                       className="form-control mb-2 rounded-pill" placeholder="Şifre"
                       value={values.password}
                       onChange={handleChange('password')}
                       onBlur={handleBlur}
                />
                {(errors.password && touched.password) && <p>{errors.password}</p>}


                {//<label htmlFor="inputPasswordConfirm" className="sr-only">Şifre Tekrarı</label>
                }
                <input type="password" name={"password_confirmation"}
                       className="form-control mb-2 rounded-pill" placeholder="Şifre Tekrarı"
                       value={values.password_confirmation}
                       onChange={handleChange('password_confirmation')}
                       onBlur={handleBlur}
                />
                {(errors.password_confirmation && touched.password_confirmation) && <p>{errors.password_confirmation}</p>}


                <button className="btn btn-lg btn-primary btn-block"
                        style={{width:"100%"}} type="button"
                        onClick={handleSubmit}
                        disabled={!isValid || isSubmitting}
                >Kayıt Ol</button><br/>
            </div>
            )}
            </Formik>

            <Link className={"mt-3"} style={{display:"block"}}  to={'/login'}>Giriş Yap</Link>
            <p className="mt-5 mb-3 text-muted">© 2021-2022</p>
        </div>
        </div>
    );
};

export default inject("AuthStore")(observer(Register));
