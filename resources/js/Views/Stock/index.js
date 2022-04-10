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
        axios.get('/api/stock',{
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
                    item.product.name && item.product.name.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.supplier.name && item.supplier.name.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.quantity.toString() && item.quantity.toString().includes(filterText.toString()) ||
                    item.totalPrice.toString() && item.totalPrice.toString().includes(filterText.toString()) ||
                    item.date && item.date.toString().includes(filterText.toString())
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
                axios.delete(`api/stock/${item.id}`,{
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
                                action={{uri: () => props.history.push('/stok/ekle'), title: 'Stok İşlemleri [EKLEME | ÇIKARMA]', class:'btn btn-success'}}
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
                                {name:'Stok Türü',selector:row => row['stockTypeString'],sortable:true},
                                {name:'Ted | Müş Adı',selector:row => {return row.supplier ? row.supplier.name : 'Ted | Müş YOK'},sortable:true},
                                {name:'Ürün Adı',selector:row => row.product.name,sortable:true},
                                {name:'Stok Miktarı',selector:row => row['quantity'],sortable:true},
                                {name:'Toplam Tutar',selector:row => row['totalPrice'],sortable:true},
                                {name:'İşlem Tarihi',selector:row => row['date'],sortable:true},
                                {
                                    name:'Düzenle',
                                    cell:(item)=> <button
                                        onClick={()=> props.history.push({
                                            pathname:`/stok/duzenle/${item.id}`})}
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
