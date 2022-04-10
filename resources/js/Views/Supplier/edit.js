import React, {useEffect, useState} from "react";
import {inject,observer} from "mobx-react";
import FrontLayout from "../../Component/Layout/front.layout";
import * as Yup from "yup";
import {Formik} from "formik";
import CustomInput from "../../Component/Form/CustomInput";
import Select from "react-select";
import axios from "axios";
import {CKEditor} from "ckeditor4-react";
import swal from 'sweetalert';
import {CircleSpinner} from "react-spinners-kit";

const Edit=(props)=>{
    const {params}=props.match;

    const [supplier,setSupplier]=useState({});
    const [supplierTypes,setSupplierTypes]=useState([{id:0,name:'Tedarikçi'},{id:1,name:'Müşteri'}]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        axios.get(`/api/supplier/${params.id}/edit`,{
            headers:{
                Authorization:'Bearer '+props.AuthStore.appState.user.access_token
            }
        }).then(res=>{
            if(res.data.success){
                setSupplier(res.data.supplier);
                setLoading(false);
            }
            else{
                swal(res.data.message);
            }
        }).catch(e=>console.log(e));
    },[]);


    const handleSubmit = (values,{resetForm,setSubmitting}) => {
        const config={
            headers:{
                'Authorization':'Bearer '+props.AuthStore.appState.user.access_token
            }
        };

        values['_method']='put';

        axios.post(`/api/supplier/${supplier.id}`,{...values},config)
            .then(res=> {
                if(res.data.success){
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
            .catch(e=> {console.log(e);setSubmitting(false);})
    };


    if(loading) return <div className={"loading-stil"}><CircleSpinner size={100} color="#686769" loading={true} /></div>


    return (
        <FrontLayout>
            <div className={"container mt-5"}>
                <Formik
                    initialValues={{
                        supplierType:supplier.supplierType,
                        name:supplier.name,
                        phone:supplier.phone,
                        email:supplier.email,
                        address:supplier.address,
                        text:supplier.text
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={
                        Yup.object().shape({
                            supplierType: Yup.number().required('Hesap Türü Seçimi Zorunludur!'),
                            name: Yup.string().required('Ad ve Soyad Girilmesi Zorunludur!'),
                            phone: Yup.string().required('Telefon Numarasının Girilmesi Zorunludur!'),
                            email: Yup.string().email('Geçerli Bir Email Adresi Giriniz! (x@x.x)').required('Email Adresinin Girilmesi Zorunludur!'),
                            address: Yup.string().required('Adres Girilmesi Zorunludur!')
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
                                <div className={"col-12 form-control mb-5"}>
                                    <Select
                                        autoFocus={true}
                                        placeholder={"Hesap Türünü Seçiniz... *"}
                                        value={supplierTypes.find(item => item.id === values.supplierType)}
                                        options={supplierTypes}
                                        getOptionLabel={option=> option.name}
                                        getOptionValue={option=> option.id}
                                        onChange={(e)=>setFieldValue('supplierType',e.id)}
                                    />
                                    {(errors.supplierType && touched.supplierType) && <p className={"form-error"}>{errors.supplierType}</p>}
                                </div>
                            </div>

                            <div className={"row bg-dark bg-opacity-10 border border-3 border-primary mb-4"}>
                                <div className={"col-md-4"}>
                                    <CustomInput
                                        title={"Ad Soyad *"}
                                        value={values.name}
                                        handleChange={handleChange('name')}
                                    />
                                    {(errors.name && touched.name) && <p className={"form-error"}>{errors.name}</p>}
                                </div>
                                <div className={"col-md-4"}>
                                    <CustomInput
                                        title={"Telefon Numarası *"}
                                        value={values.phone}
                                        handleChange={handleChange('phone')}
                                    />
                                    {(errors.phone && touched.phone) && <p className={"form-error"}>{errors.phone}</p>}
                                </div>
                                <div className={"col-md-4"}>
                                    <CustomInput
                                        title={"Email Adresi *"}
                                        value={values.email}
                                        handleChange={handleChange('email')}
                                    />
                                    {(errors.email && touched.email) && <p className={"form-error"}>{errors.email}</p>}
                                </div>
                            </div>

                            <div className={"row bg-light border border-3 border-primary mb-4"}>
                                <div className={"col-md-12"}>
                                    <CustomInput
                                        title={"Adres *"}
                                        value={values.address}
                                        handleChange={handleChange('address')}
                                    />
                                    {(errors.address && touched.address) && <p className={"form-error"}>{errors.address}</p>}
                                </div>
                            </div>

                            <div className={"row bg-light border border-3 border-primary mb-4"}>
                                <div className={"col-12"}>
                                    <CKEditor
                                        initData={values.text}
                                        onInstanceReady={ () => {
                                            //alert( 'Editor is ready!' );
                                        } }
                                        onChange={(event)=>{
                                            const data=event.editor.getData();
                                            setFieldValue('text',data);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={"row mt-5"}><div className={"col-12"}>
                                <button className="btn btn-lg btn-primary btn-block w-50 float-end"
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                >Tedarikçi | Müşteri &nbsp;DÜZENLE</button>
                            </div></div>
                            <br/><br/><br/>
                        </div>
                    )}
                </Formik>
            </div>
        </FrontLayout>
    );
};
export default inject("AuthStore")(observer(Edit));
