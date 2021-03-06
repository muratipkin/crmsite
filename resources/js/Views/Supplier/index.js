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
        axios.get('/api/supplier',{
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
                    item.name && item.name.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.phone && item.phone.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.email && item.email.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.address && item.address.toLowerCase().includes(filterText.toLowerCase())
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
            title:'Silmek ??stedi??inize Emin misiniz?',
            text:'UYARI: Silme i??lemini, daha sonra geri alamazs??n??z!',
            icon:'warning',
            buttons:true,
            dangerMode:true
        })
        .then((willDelete)=>{
            if(willDelete){
                axios.delete(`api/supplier/${item.id}`,{
                    headers:{
                        Authorization:'Bearer '+props.AuthStore.appState.user.access_token
                    }
                })
                    .then(res=>{
                        if(res.data.success){
                            if(refresh)//Her silmede refresh'i tersliyoruz ki useEffect ??al????s??n da silinenler kaybolsun
                                setRefresh(false);
                            else
                                setRefresh(true);

                            setLoading(true);//useEffect'in ??al????mas?? bitene kadar, sayfay?? g??sterme
                            swal({
                                title:'BA??ARILI!',
                                text:res.data.message,
                                icon:'success'
                            });
                        }
                        else {
                            swal({
                                title:'BA??ARISIZ!',
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
                                action={{uri: () => props.history.push('/tedarikci/ekle'), title: 'YEN?? Tedarik??i | M????teri EKLE', class:'btn btn-success'}}
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
                                {name:'Hesap T??r??',selector:row => row['supplierTypeString'],sortable:true},
                                {name:'Ad Soyad',selector:row => row['name'],sortable:true},
                                {name:'Telefon',selector:row => row['phone'],sortable:true},
                                {name:'Email',selector:row => row['email'],sortable:true},
                                {name:'Adres',selector:row => row['address'],sortable:true},
                                {
                                    name:'D??zenle',
                                    cell:(item)=> <button
                                        onClick={()=> props.history.push({
                                            pathname:`/tedarikci/duzenle/${item.id}`})}
                                        className={"btn btn-sm btn-outline-primary"}>D??zenle</button>
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
