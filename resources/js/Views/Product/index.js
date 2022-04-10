import React, {useEffect,useState} from "react";
import {inject,observer} from "mobx-react";
import FrontLayout from "../../Component/Layout/front.layout";
import axios from "axios";
import DataTable from 'react-data-table-component';
import SubHeaderComponent from "../../Component/Form/SubHeaderComponent";
import ExpandedComponent from "../../Component/Form/ExpandedComponent";
import NoDataDataTable from "../../Component/Form/NoDataDataTable";
import swal from "sweetalert";
import {CircleSpinner} from "react-spinners-kit";

const Index=(props)=>{
    const [data,setData]=useState([]);
    const [filter,setFilter]=useState({
        filteredData:[],
        text:'',
        isFilter:false
    });
    const [refresh,setRefresh]=useState(false);
    const [loading,setLoading]= useState(true);

    useEffect(()=>{
        axios.get('/api/product',{
            headers:{
                Authorization:'Bearer '+props.AuthStore.appState.user.access_token
            }
        }).then(res=>{
            setData(res.data.data);
            setLoading(false);
        }).catch(e=>console.log(e));
    },[refresh]);

    const filterItem = (e) => {
        const filterText=e.target.value;
        if(filterText!=''){
            const filteredItems = data.filter(
                (item) => (
                    item.brand && item.brand.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.modelCode && item.modelCode.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.name && item.name.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.barcode && item.barcode.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.buyingPrice.toString() && item.buyingPrice.toString().includes(filterText.toString()) ||
                    item.sellingPrice.toString() && item.sellingPrice.toString().includes(filterText.toString()) ||
                    item.stock.toString() && item.stock.toString().includes(filterText.toString())
                )
            );
            setFilter({
                filteredData:filteredItems,
                text:filterText,
                isFilter:true
            });
        }
        else {
            setFilter({
                filteredData:[],
                text:'',
                isFilter:false
            });
        }
    };

    const deleteItem = (item) => {
        swal({
            title:'Silmek İstediğinize Emin misiniz?',
            text:'UYARI: Silme işlemini, daha sonra geri alamazsınız!',
            icon:'warning',
            buttons:true,
            dangerMode:true
        })
        .then((willDelete)=>{
            if(willDelete){
                axios.delete(`api/product/${item.id}`,{
                    headers:{
                        Authorization:'Bearer '+props.AuthStore.appState.user.access_token
                    }
                })
                .then(res=>{
                    if(res.data.success){
                        if(refresh)//Her silmede refresh'i tersliyoruz ki useEffect çalışsın da silinenler kaybolsun
                            setRefresh(false);
                        else
                            setRefresh(true);

                        setLoading(true);//useEffect'in çalışması bitene kadar, sayfayı gösterme
                        swal({
                            title:'BAŞARILI!',
                            text:res.data.message,
                            icon:'success'
                        });
                    }
                    else {
                        swal(res.data.message);
                    }
                })
                .catch(e=>console.log(e));
            }
        })
        .catch(e=>console.log(e));
    };


    if(loading) return <div className={"loading-stil"}><CircleSpinner size={100} color="#686769" loading={true} /></div>


    return (
    <FrontLayout>
        <div>
            <div className={"container"}>
                <div className={"row mt-3"}><div className={"col-12"}>
                    <DataTable
                        data={(filter.isFilter) ? filter.filteredData : data}
                        subHeader={true}
                        subHeaderComponent={<SubHeaderComponent
                            action={{uri: () => props.history.push('/urun/ekle'), title: 'Yeni Ürün Ekle', class:'btn btn-success'}}
                            filter={filterItem}
                        />}
                        expandableRowsComponent={ExpandedComponent}
                        expandableRows
                        noDataComponent=<NoDataDataTable/>
                        theme={"dark"}
                        responsive={true}
                        hover={true}
                        pagination
                        fixedHeader
                        columns={[
                        {name:'Marka',selector:row => row['brand'],sortable:true},
                        {name:'Model Kodu',selector:row => row['modelCode'],sortable:true},
                        {name:'Ürün Adı',selector:row => row['name'],sortable:true},
                        {name:'Barkodu',selector:row => row['barcode'],sortable:true},
                        {name:'Alış Fiyatı',selector:row => row['buyingPrice'],sortable:true},
                        {name:'Satış Fiyatı',selector:row => row['sellingPrice'],sortable:true},
                        {name:'Stok Miktarı',selector:row => row['stock'],sortable:true},
                        {name:'KDV',selector:row => row['tax'],sortable:true},
                        {
                            name:'Düzenle',
                            cell:(item)=> <button
                                onClick={()=> props.history.push({
                                    pathname:`/urun/duzenle/${item.id}`})}
                                className={"btn btn-sm btn-outline-primary"}>Düzenle</button>
                        },
                        {
                            name:'Sil',
                            cell:(item)=> <button
                                className={"btn btn-sm btn-outline-danger"}
                                onClick={()=>deleteItem(item)}
                            >Sil</button>,
                            button:true
                        }
                        ]}
                    />
                </div></div>
            </div>
        </div>
    </FrontLayout>
    );
};

export default inject("AuthStore")(observer(Index));
