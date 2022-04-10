import React, {useEffect, useState} from "react";
import {inject,observer} from "mobx-react";
import FrontLayout from "../../Component/Layout/front.layout";
import * as Yup from "yup";
import {Formik} from "formik";
import CustomInput from "../../Component/Form/CustomInput";
import axios from "axios";
import ImageUploader from "react-images-upload";
import swal from 'sweetalert';
import {CircleSpinner} from "react-spinners-kit";

const Index=(props)=>{

    const [loading,setLoading]=useState(true);
    const [user,setUser]=useState();
    const [newUser,setNewUser]=useState();
    const [image,setImage]=useState();

    useEffect(()=>{
        axios.get(`/api/profile`,{
            headers:{
                Authorization:'Bearer '+props.AuthStore.appState.user.access_token
            }
        }).then(res=>{
            if(res.data.success){
                setUser(res.data.user);
                setImage('/'+res.data.user.photo);
                setLoading(false);
            }
            else{
                swal(res.data.message);
            }
        }).catch(e=>console.log(e));
    },[]);

    const handleSubmit = (values,{setSubmitting}) => {
        //console.log(newUser);
        if(newUser){
            if(image===newUser.photo && values.password==='' && values.name===newUser.name && values.email===newUser.email){
                swal({
                    title:'UYARI!',
                    text:'Az Önce Yaptığınız Değişiklikler Üzerinde, Tekrar Değişiklik Yapmalısınız!',
                    icon:'warning'
                });
                setSubmitting(false);
                return;
            }
        }
        if(image==='/'+user.photo && values.password==='' && values.name===user.name && values.email===user.email){
            swal({
                title:'UYARI!',
                text:'Herhangi Bir Değişiklik Yaptıktan Sonra, Güncelleme İsteğinde Bulunduğunuzdan Emin Olun!',
                icon:'warning'
            });
            setSubmitting(false);
            return;
        }

        const data=new FormData();
        data.append('_method','put');
        data.append('image',image[0]);
        data.append('name',values.name);
        data.append('email',values.email);
        data.append('password',values.password);

        const config={
            headers:{
                'Accept':'application/json',
                'content-type':'multipart/form-data',
                'Authorization':'Bearer '+props.AuthStore.appState.user.access_token
            }
        };

        axios.post(`/api/profile/${user.id}`,data,config)
        .then(res=> {
            if(res.data.success){
                setNewUser(res.data.user);
                //console.log(newUser);
                setImage(res.data.user.photo);
                values.password=''
                swal({
                    title:'BAŞARILI!',
                    text:res.data.message,
                    icon:'success'
                });
                setSubmitting(false);
            }
            else {
                swal(res.data.message);
                setSubmitting(false);
            }
        })
        .catch(e=>{console.log(e);setSubmitting(false);})
    };



    if(loading) return <div className={"loading-stil"}><CircleSpinner size={100} color="#686769" loading={true} /></div>



    return (
        <FrontLayout>
            <div className={"container mt-5"}>
                <Formik
                    initialValues={{
                        name:    user.name,
                        email:   user.email,
                        password:''
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={
                        Yup.object().shape({
                            name:  Yup.string().required('Ad - Soyad Girilmesi Zorunludur!'),
                            email: Yup.string().email().required('Email Adresinin Girilmesi Zorunludur!'),
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
                          touched,
                          setFieldValue
                      })=>(


                        <div>
                            <div className={"row mb-2"}>
                                <div className={"col-md-12 text-center"}>
                                    <img src={(user.photo)==='' ? 'files/photo/avatar.png' : user.photo}/>
                                </div>
                            </div>

                            <div className={"row mb-2"}>
                                <div className={"col-12 form-control mb-5"}>
                                    <ImageUploader
                                        withIcon={true}
                                        //defaultImages={[image]}
                                        buttonText='Profil Resminizi Seçiniz'
                                        onChange={(pictureFiles,pictures)=>setImage(pictureFiles)}
                                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                        label={'Maximum Dosya Boyutu: 1.55mb, Dosya Türleri: jpg | gif | png'}
                                        maxFileSize={1626048}
                                        withPreview={true}
                                        singleImage={true}
                                    />
                                </div>
                            </div>

                            <div className={"row bg-dark bg-opacity-10 border border-3 border-primary mb-4"}>
                                <div className={"col-md-4"}>
                                    <CustomInput
                                        title={"Adınız Soyadınız"}
                                        value={values.name}
                                        handleChange={handleChange('name')}
                                    />
                                    {(errors.name && touched.name) && <p className={"form-error"}>{errors.name}</p>}
                                </div>
                                <div className={"col-md-4"}>
                                    <CustomInput
                                        title={"Email Adresiniz"}
                                        value={values.email}
                                        handleChange={handleChange('email')}
                                    />
                                    {(errors.email && touched.email) && <p className={"form-error"}>{errors.email}</p>}
                                </div>
                                <div className={"col-md-4"}>
                                    <CustomInput
                                        title={"Şifreniz"}
                                        value={values.password}
                                        handleChange={handleChange('password')}
                                    />
                                    {(errors.password && touched.password) && <p className={"form-error"}>{errors.password}</p>}
                                </div>
                            </div>

                            <div className={"row mt-5"}><div className={"col-12"}>
                                <button className="btn btn-lg btn-primary btn-block w-50 float-end"
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={!isValid || isSubmitting}
                                >Profil Bilgilerimi Güncelle</button>
                            </div></div>

                            <br/><br/><br/>

                        </div>
                    )}
                </Formik>
            </div>
        </FrontLayout>
    );
};

export default inject("AuthStore")(observer(Index));
