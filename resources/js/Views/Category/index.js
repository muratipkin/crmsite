import React, {useEffect,useState} from "react";
import {inject,observer} from "mobx-react";
import FrontLayout from "../../Component/Layout/front.layout";
import axios from "axios";
import DataTable from 'react-data-table-component';
import SubHeaderComponent from "../../Component/Form/SubHeaderComponent";
import NoDataDataTable from "../../Component/Form/NoDataDataTable";
import swal from "sweetalert";
import { CircleSpinner } from "react-spinners-kit";

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
        axios.get('/api/category',{
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
                    item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
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
                axios.delete(`api/category/${item.id}`,{
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
                        swal({
                            title:'BAŞARISIZ!',
                            text:res.data.message,
                            icon:'warning'
                        });
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
                                action={{uri: () => props.history.push('/kategori/ekle'), title: 'Yeni Kategori Ekle', class:'btn btn-success'}}
                                filter={filterItem}
                            />}
                            noDataComponent=<NoDataDataTable/>
                            responsive={true}
                            hover={true}
                            pagination
                            fixedHeader
                            columns={[
                                {name:'Kategori Adı',selector:row => row['name'],sortable:true},
                                {
                                    name:'Düzenle',
                                    cell:(item)=> <button
                                        onClick={()=> props.history.push({
                                            pathname:`/kategori/duzenle/${item.id}`})}
                                        className={"btn btn-sm btn-outline-primary float-end"}>Düzenle</button>
                                },
                                {
                                    name:'Sil',
                                    cell:(item)=> <button
                                        className={"btn btn-sm btn-outline-danger float-end"}
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
