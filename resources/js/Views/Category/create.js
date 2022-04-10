import React, {useEffect, useState} from "react";
import {inject,observer} from "mobx-react";
import FrontLayout from "../../Component/Layout/front.layout";
import * as Yup from "yup";
import {Formik} from "formik";
import CustomInput from "../../Component/Form/CustomInput";
import axios from "axios";
import swal from 'sweetalert';

const Create=(props)=>{

    const handleSubmit = (values,{resetForm,setSubmitting}) => {
        const data=new FormData();
        data.append('name',values.name);

        const config={
            headers:{
                'Accept':'application/json',
                'content-type':'multipart/form-data',
                'Authorization':'Bearer '+props.AuthStore.appState.user.access_token
            }
        };

        axios.post('/api/category',data,config)
        .then(res=> {
            if(res.data.success){
                swal({
                    title:'BAŞARILI!',
                    text:res.data.message,
                    icon:'success'
                });
                setSubmitting(false);
                resetForm({});
            }
            else {
                swal({
                    title:'HATA!',
                    text:res.data.message,
                    icon:'error'
                });
                setSubmitting(false);
            }
        })
        .catch(e=>{console.log(e);setSubmitting(false);})
    };

    return (
        <FrontLayout>
            <div className={"container mt-5"}>
                <Formik
                    initialValues={{
                        name:''
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={
                        Yup.object().shape({
                            name: Yup.string().required('Kategori Adının Girilmesi Zorunludur!')
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
                    })=>(

                    <div>
                        <div className={"row bg-dark bg-opacity-10 border border-3 border-primary mb-4"}>
                            <div className={"col-md-6"}>
                                <CustomInput
                                    title={"Kategori Adı"}
                                    value={values.name}
                                    handleChange={handleChange('name')}
                                />
                                {(errors.name && touched.name) && <p className={"form-error"}>{errors.name}</p>}
                            </div>
                        </div>

                        <div className={"row mt-5"}><div className={"col-12"}>
                            <button className="btn btn-lg btn-primary btn-block w-50 float-end"
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                            >Kategori Ekle</button>
                        </div></div>
                        <br/><br/><br/>
                    </div>
                    )}
                </Formik>
            </div>
        </FrontLayout>
    );
};
export default inject("AuthStore")(observer(Create));
