import React, {useEffect, useState} from "react";
import {inject,observer} from "mobx-react";
import FrontLayout from "../../Component/Layout/front.layout";
import * as Yup from "yup";
import {Formik} from "formik";
import CustomInput from "../../Component/Form/CustomInput";
import Select from "react-select";
import axios from "axios";
import ImageUploader from "react-images-upload";
import {CKEditor} from "ckeditor4-react";
import swal from 'sweetalert';
import {CircleSpinner} from "react-spinners-kit";

const Create=(props)=>{

    const [categories,setCategories]=useState([]);
    const [images,setImages]=useState([]);
    const [properties,setProperties]=useState([]);
    const [loading,setLoading]= useState(true);

    useEffect(()=>{
        axios.get('/api/product/create',{
            headers:{
                Authorization:'Bearer '+props.AuthStore.appState.user.access_token
            }
        }).then(res=>{
            setCategories(res.data.categories);
            setLoading(false);
        }).catch(e=>console.log(e));
    },[images]);

    const handleSubmit = (values,{resetForm,setSubmitting}) => {

        properties.map((item,index)=>{
            let property=properties[index].property;
            let value=properties[index].value;
            while(property==='' || value===''){
                properties.splice(index,1);
                if(index<properties.length){
                    property=properties[index].property;
                    value=properties[index].value;
                } else {
                    break;
                }
            }
        });
        setProperties([...properties]);

        if(properties.length>0){
            swal({
                title:'Eklediğiniz Özellik Sayısı',
                text:`${properties.length} Adet Özelliği, Başarıyla Eklediniz! Devam Etmek İstiyor musunuz?`,
                icon:'success',
                buttons:true,
                dangerMode:true
            })
                .then((willDelete)=>{
                    if(willDelete){


                        //handleSubmit
                        const data=new FormData();
                        images.forEach((imageFile)=>{
                            data.append('file[]',imageFile);
                        });
                        data.append('categoryId',values.categoryId);
                        data.append('name',values.name);
                        data.append('modelCode',values.modelCode);
                        data.append('brand',values.brand);
                        data.append('barcode',values.barcode);
                        data.append('stock',values.stock);
                        data.append('tax',values.tax);
                        data.append('buyingPrice',values.buyingPrice);
                        data.append('sellingPrice',values.sellingPrice);
                        data.append('text',values.text);
                        data.append('properties',JSON.stringify(properties));


                        const config={
                            headers:{
                                'Accept':'application/json',
                                'content-type':'multipart/form-data',
                                'Authorization':'Bearer '+props.AuthStore.appState.user.access_token
                            }
                        };

                        axios.post('/api/product',data,config)
                            .then(res=> {
                                if(res.data.success){
                                    swal({
                                        title:'BAŞARILI!',
                                        text:res.data.message,
                                        icon:'success'
                                    });
                                    resetForm({});
                                    setProperties([]);
                                    setImages([]);
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



                    }
                })
                .catch(e=>console.log(e));
        } else {
            swal({
                title:'Özellik Eklemediniz!',
                text:`Hiçbir Özellik Eklemeden Devam Etmek İstiyor musunuz?`,
                icon:'warning',
                buttons:true,
                dangerMode:true
            })
                .then((willDelete)=>{
                    if(willDelete){


                        //handleSubmit
                        const data=new FormData();
                        images.forEach((imageFile)=>{
                            data.append('file[]',imageFile);
                        });
                        data.append('categoryId',values.categoryId);
                        data.append('name',values.name);
                        data.append('modelCode',values.modelCode);
                        data.append('brand',values.brand);
                        data.append('barcode',values.barcode);
                        data.append('stock',values.stock);
                        data.append('tax',values.tax);
                        data.append('buyingPrice',values.buyingPrice);
                        data.append('sellingPrice',values.sellingPrice);
                        data.append('text',values.text);
                        data.append('properties',JSON.stringify(properties));


                        const config={
                            headers:{
                                'Accept':'application/json',
                                'content-type':'multipart/form-data',
                                'Authorization':'Bearer '+props.AuthStore.appState.user.access_token
                            }
                        };

                        axios.post('/api/product',data,config)
                            .then(res=> {
                                if(res.data.success){
                                    swal({
                                        title:'BAŞARILI!',
                                        text:res.data.message,
                                        icon:'success'
                                    });
                                    resetForm({});
                                    setProperties([]);
                                    setImages([]);
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



                    }
                })
                .catch(e=>console.log(e));
        }
    };








    const newProperty = () => {
        setProperties([...properties,{property:'',value:''}]);
    };

    const removeProperty = (index) => {
        properties.splice(index,1);
        setProperties([...properties]);
    };

    const changeTextInput = (event,index) => {
        properties[index][event.target.name]=event.target.value;
        setProperties([...properties]);
    };



    if(loading) return <div className={"loading-stil"}><CircleSpinner size={100} color="#686769" loading={true} /></div>



    return (
    <FrontLayout>
        <div className={"container mt-5"}>
        <Formik
            initialValues={{
                categoryId:'',
                name:'',
                modelCode:'',
                brand:'',
                barcode:'',
                stock:0,
                tax:0,
                buyingPrice:'',
                sellingPrice:'',
                text:'',
            }}
            onSubmit={handleSubmit}
            validationSchema={
                Yup.object().shape({
                    categoryId: Yup.number().required('Kategori Seçimi Zorunludur!'),
                    name: Yup.string().required('Ürün Adının Girilmesi Zorunludur!'),
                    modelCode: Yup.string().required('Model Kodunun Girilmesi Zorunludur!'),
                    brand: Yup.string().required('Markanın Girilmesi Zorunludur!'),
                    barcode: Yup.string().required('Barkodun Girilmesi Zorunludur!'),
                    tax: Yup.string().required('KDV Girilmesi Zorunludur!'),
                    buyingPrice: Yup.number().required('Alış Fiyatının Girilmesi Zorunludur!'),
                    sellingPrice: Yup.number().required('Satış Fiyatının Girilmesi Zorunludur!')
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
            resetForm,
            setSubmitting,
            setFieldValue
        })=>(


        <div>
            <div className={"row mb-2"}>
                <div className={"col-12 form-control mb-5"}>
                    <ImageUploader
                        withIcon={true}
                        buttonText='Resimleri Seçiniz'
                        onChange={(pictureFiles)=>setImages(images.concat(pictureFiles))}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        label={'Maximum Dosya Boyutu: 1.55mb, Dosya Türleri: jpg | gif | png'}
                        maxFileSize={1626048}
                        withPreview={true}
                    />
                </div>
            </div>

            <div className={"row mb-2"}>
                <div className={"col-12 form-control mb-5"}>
                    <Select
                        autoFocus={true}
                        placeholder={"Ürün Kategorisi Seçiniz... *"}
                        options={categories}
                        getOptionLabel={option=> option.name}
                        getOptionValue={option=> option.id}
                        onChange={(e)=>setFieldValue('categoryId',e.id)}
                    />
                    {(errors.categoryId && touched.categoryId) && <p className={"form-error"}>{errors.categoryId}</p>}
                </div>
            </div>

            <div className={"row bg-dark bg-opacity-10 border border-3 border-primary mb-4"}>
                <div className={"col-md-4"}>
                    <CustomInput
                        title={"Ürün Adı *"}
                        value={values.name}
                        handleChange={handleChange('name')}
                    />
                    {(errors.name && touched.name) && <p className={"form-error"}>{errors.name}</p>}
                </div>
                <div className={"col-md-4"}>
                    <CustomInput
                        title={"Ürün Model Kodu *"}
                        value={values.modelCode}
                        handleChange={handleChange('modelCode')}
                    />
                    {(errors.modelCode && touched.modelCode) && <p className={"form-error"}>{errors.modelCode}</p>}
                </div>
                <div className={"col-md-4"}>
                    <CustomInput
                        title={"Marka *"}
                        value={values.brand}
                        handleChange={handleChange('brand')}
                    />
                    {(errors.brand && touched.brand) && <p className={"form-error"}>{errors.brand}</p>}
                </div>
            </div>

            <div className={"row bg-light border border-3 border-primary mb-4"}>
                <div className={"col-md-4"}>
                    <CustomInput
                        title={"Barkod Numarası *"}
                        value={values.barcode}
                        handleChange={handleChange('barcode')}
                    />
                    {(errors.barcode && touched.barcode) && <p className={"form-error"}>{errors.barcode}</p>}
                </div>
                <div className={"col-md-4"}>
                    <CustomInput
                        title={"Stok"}
                        //value={values.stock} //placeholder ile çakışıyor
                        placeholder={"Stok Bölümünden Ekleyiniz!"}
                        disabled={true}
                        handleChange={handleChange('stock')}
                        type={"number"}
                        min={0}
                    />
                </div>
                <div className={"col-md-4"}>
                    <CustomInput
                        title={"KDV *"}
                        value={values.tax}
                        handleChange={handleChange('tax')}
                        type={"number"}
                        min={0}
                    />
                    {(errors.tax && touched.tax) && <p className={"form-error"}>{errors.tax}</p>}
                </div>
            </div>

            <div className={"row bg-dark bg-opacity-10 border border-3 border-primary mb-4"}>
                <div className={"col-md-4"}>
                    <CustomInput
                        title={"Alış Fiyatı *"}
                        value={values.buyingPrice}
                        handleChange={handleChange('buyingPrice')}
                        type={"number"}
                        min={0}
                    />
                    {(errors.buyingPrice && touched.buyingPrice) && <p className={"form-error"}>{errors.buyingPrice}</p>}
                </div>
                <div className={"col-md-4"}>
                    <CustomInput
                        title={"Satış Fiyatı *"}
                        value={values.sellingPrice}
                        handleChange={handleChange('sellingPrice')}
                        type={"number"}
                        min={0}
                    />
                    {(errors.sellingPrice && touched.sellingPrice) && <p className={"form-error"}>{errors.sellingPrice}</p>}
                </div>
            </div>

            <div className={"row bg-light border border-3 border-primary mb-4"}>
                <div className={"col-12"}>
                    <CKEditor
                        initData={values.text}
                        onInstanceReady={()=>{
                            swal({
                                title:'EDİTÖR HAZIR!',
                                text:'Editör, kullanıma hazır!',
                                icon:'success'
                            });
                        }}
                        onChange={(event)=>{
                            const data=event.editor.getData();
                            setFieldValue('text',data);
                        }}
                    />
                </div>
            </div>

            <div className={"row"}>
                <div className={"col-12"}>
                    <button className={"btn btn-primary w-25 float-end mb-3"}
                        type={"button"}
                        onClick={newProperty}
                    >
                        Yeni Özellik Ekle
                    </button>
                </div>
            </div>

            <div>
                {properties.map((item,index)=>(
                    <div className={"row mb-3"} key={index}>
                        <div className={"col-md-5"}>
                            <label>Özellik Adı: </label>
                            <input type={"text"} className={"form-control"}
                                name={"property"}
                                onChange={(event)=>changeTextInput(event,index)}
                                value={item.property}
                            />
                        </div>
                        <div className={"col-md-5"}>
                            <label>Özellik Değeri: </label>
                            <input type={"text"} className={"form-control"}
                               name={"value"}
                               onChange={(event)=>changeTextInput(event,index)}
                               value={item.value}
                            />
                        </div>
                        <div className={"col-md-2"} style={{display:"flex",alignItems:"flex-end"}}>
                            <button onClick={()=>removeProperty(index)} type={"button"} className={"btn btn-danger"}>X</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={"row mt-5"}><div className={"col-12"}>
                <button className="btn btn-lg btn-primary btn-block w-50 float-end"
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                >Ürün Ekle</button>
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
