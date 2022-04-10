import React, {useEffect, useState} from "react";
import {inject,observer} from "mobx-react";
import FrontLayout from "../../Component/Layout/front.layout";
import * as Yup from "yup";
import {Formik, useFormik} from "formik";
import CustomInput from "../../Component/Form/CustomInput";
import Select from "react-select";
import axios from "axios";
import ImageUploader from "react-images-upload";
import {CKEditor} from "ckeditor4-react";
import swal from 'sweetalert';
import {CircleSpinner} from "react-spinners-kit";

const Edit=(props)=>{
    const {params}=props.match;

    const [products,setProducts]=useState([]);
    const [stockTypes,setStockTypes]=useState([]);
    const [loading,setLoading]=useState(true);
    const [suppliers,setSuppliers]=useState([]);
    const [accountType,setAccountType]=useState("Tedarikçi | Müşteri");

    const [data,setData]=useState([]);

    useEffect(()=>{
        axios.get(`/api/stock/${params.id}/edit`,{
            headers:{
                Authorization:'Bearer '+props.AuthStore.appState.user.access_token
            }
        }).then(res=>{
            if(res.data.success){
                setProducts(res.data.products);
                setStockTypes(res.data.stockTypes);
                setSuppliers(res.data.suppliers);

                setData(res.data.data);
                setLoading(false);
            }
            else{
                swal(res.data.message);
            }
        }).catch(e=>console.log(e));
    },[]);

    const changeStockType = (stockType) => {
        axios.post('/api/stock/get-supplier',{stockType},{
            headers:{
                Authorization:'Bearer '+props.AuthStore.appState.user.access_token
            }
        }).then(res=> {
            setSuppliers(res.data.suppliers);
            setAccountType(res.data.accountType);
        }).catch(e=>console.log(e));
    }

    const handleSubmit = (values,{resetForm,setSubmitting}) => {
        const config={
            headers:{
                'Authorization':'Bearer '+props.AuthStore.appState.user.access_token
            }
        };

        values['_method']='put';

        axios.post(`/api/stock/${data.id}`, {...values},config)
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


    if(loading) return <div className={"loading-stil"}><CircleSpinner size={100} color="#686769" loading={true} /></div>



    return (
        <FrontLayout>
            <div className={"container mt-5"}>
                <Formik
                    initialValues={{
                        stockType:data.stockType,
                        supplierId:data.supplierId,
                        productId:data.productId,
                        quantity:data.quantity,
                        totalPrice:data.totalPrice,
                        date:data.date,
                        text:data.text,
                        isStock:data.isStock
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={
                        Yup.object().shape({
                            stockType: Yup.number().required('İşlem Türü Seçimi Zorunludur!'),
                            supplierId: Yup.number().required('Tedarikçi | Müşteri Seçimi Zorunludur!'),
                            productId: Yup.number().required('Ürün Seçimi Zorunludur!'),
                            quantity: Yup.number().required('Stok Adedinin Girilmesi Zorunludur!'),
                            totalPrice: Yup.number().required('Toplam Tutarın Girilmesi Zorunludur!'),
                            date: Yup.date().required('İşlem Tarihinin Seçilmesi Zorunludur!')
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
                                        value={stockTypes.find(item=> item.id===values.stockType)}
                                        placeholder={"İşlem Türünü Seçiniz... (Ekleme | Çıkarma)"}
                                        options={stockTypes}
                                        getOptionLabel={option=> option.name}
                                        getOptionValue={option=> option.id}
                                        isDisabled
                                        /*onChange={(e)=> {
                                            changeStockType(e.id);
                                            setFieldValue('stockType', e.id);
                                        }}*/
                                    />
                                    {(errors.stockType && touched.stockType) && <p className={"form-error mt-2"}>{errors.stockType}</p>}
                                </div>
                            </div>

                            <div className={"row mb-2"}>
                                <div className={"col-12 form-control mb-5"}>
                                    <Select
                                        value={suppliers.find(item=> item.id===values.supplierId)}
                                        placeholder={accountType+" Seçiniz..."}
                                        options={suppliers}
                                        getOptionLabel={option=> option.name}
                                        getOptionValue={option=> option.id}
                                        isDisabled
                                        //onChange={(e)=>setFieldValue('supplierId',e.id)}
                                    />
                                    {(errors.supplierId && touched.supplierId) && <p className={"form-error mt-2"}>{errors.supplierId}</p>}
                                </div>
                            </div>

                            <div className={"row mb-2"}>
                                <div className={"col-12 form-control mb-5"}>
                                    <Select
                                        value={products.find(item=> item.id===values.productId)}
                                        placeholder={"Ürün Seçiniz..."}
                                        options={products}
                                        getOptionLabel={option=> option.modelCode+' - '+option.name}
                                        getOptionValue={option=> option.id}
                                        isDisabled
                                        //onChange={(e)=>setFieldValue('productId',e.id)}
                                    />
                                    {(errors.productId && touched.productId) && <p className={"form-error mt-2"}>{errors.productId}</p>}
                                </div>
                            </div>

                            <div className={"row bg-dark bg-opacity-10 border border-3 border-primary mb-4"}>
                                <div className={"col-md-4"}>
                                    <CustomInput
                                        autoFocus={true}
                                        title={"Stok Adedi *"}
                                        type={"number"}
                                        value={values.quantity}
                                        handleChange={handleChange('quantity')}
                                    />
                                    {(errors.quantity && touched.quantity) && <p className={"form-error"}>{errors.quantity}</p>}
                                </div>
                                <div className={"col-md-4"}>
                                    <CustomInput
                                        title={"Toplam Tutar *"}
                                        type={"number"}
                                        value={values.totalPrice}
                                        handleChange={handleChange('totalPrice')}
                                    />
                                    {(errors.totalPrice && touched.totalPrice) && <p className={"form-error"}>{errors.totalPrice}</p>}
                                </div>
                                <div className={"col-md-4"}>
                                    <CustomInput
                                        title={"Tarih *"}
                                        type={"date"}
                                        value={values.date}
                                        handleChange={handleChange('date')}
                                    />
                                    {(errors.date && touched.date) && <p className={"form-error"}>{errors.date}</p>}
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

                            {/*<div className={"row"}>
                                <div className={"col-md-8"}></div>
                                <div className={"col-md-4"}>
                                    <div className={"form-control border-5"}>
                                        <input checked={values.isStock} id={"isStock"} type={"checkbox"} onChange={handleChange('isStock')}/>
                                        <label className={"ms-1"} htmlFor={"isStock"}>Stoka Ekle / Stoktan Çıkar</label>
                                    </div>
                                </div>
                            </div>*/}

                            <div className={"row mt-5"}><div className={"col-12"}>
                                <button className="btn btn-lg btn-primary btn-block w-50 float-end"
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                >Stok Ekle (Çıkar)</button>
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
