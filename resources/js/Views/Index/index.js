import React,{useEffect,useState} from "react";
import {inject,observer} from "mobx-react";
import FrontLayout from "../../Component/Layout/front.layout";
import axios from "axios";
import swal from "sweetalert";
import { Bar,Line } from 'react-chartjs-2';
import { CircleSpinner } from "react-spinners-kit";
import {Helmet} from "react-helmet";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);




const Index=(props)=>{

    const [loading,setLoading]= useState(true);
    const [total,setTotal]= useState({
        'category':0,
        'product':0,
        'supplier':0,
        'stock':0
    });
    const [stock,setStock]= useState({
        availableProduct:0,
        unAvailableProduct:0
    });
    const [chartStock,setChartStock]= useState([]);
    const [dailyTransaction,setDailyTransaction]= useState([]);

    useEffect(() => {
        axios.post(`/api/home`,{},{
            headers:{
                Authorization:'Bearer '+props.AuthStore.appState.user.access_token
            }
        }).then(res=>{
            setTotal(res.data.total);
            setStock(res.data.stock);
            setChartStock(res.data.chartStock);
            setDailyTransaction(res.data.dailyTransaction);
            setLoading(false);
        }).catch(e=>{
            swal(e);
            setLoading(false);
        });
    },[]);




    if(loading) return <div className={"loading-stil"}><CircleSpinner size={100} color="#686769" loading={true} /></div>




    const options2 = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Son Bir Haftada Yapılan, Günlük, Stok İşlem Sayıları',
            },
        },
    };
    //const labels2 = dailyTransactionDate;
    const data2 = {
        //labels2,
        datasets: [
            {
                label: 'Günlük, Stok İşlemi Sayısı',
                data: dailyTransaction,  //  [ ["2022-03-20",5], ["2022-03-21",15], ["2022-03-22",55] ], //isteği format iç içe array VEYA object yani {"2022-03-20":5, "2022-03-21":15, "2022-03-22":55}
                borderColor: 'rgb(30, 50, 255)',
                backgroundColor: 'rgba(255, 255, 255, 0)',
            },
            /*{
                label: 'Dataset 2',
                data: { min: -1000, max: 1000 },
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },*/
        ],
    };


    const chartStockModelCodes=[];
    const chartStockStocks=[];
    chartStock.map(item =>{
        chartStockModelCodes.push(item.modelCode);
        chartStockStocks.push(item.stock);
    });
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Stok Miktarı En Fazla Olan 7 Ürün',
            },
        },
    };
    const labels = chartStockModelCodes;
    const data = {
        labels,
        datasets: [
            {
                label: 'Ürün Miktarı',
                data: chartStockStocks,
                backgroundColor: 'rgba(255, 100, 135, 0.5)',
            },
            /*{
                label: 'Ürün Miktarı',
                data: chartStockStocks,
                backgroundColor: 'rgba(50, 160, 235, 0.5)',
            },*/
        ],
    };




    return (
        <FrontLayout>
            <Helmet>
                <title>EVEREST MERMER</title>
            </Helmet>
            <div className={"container mt-5"}>

                <div className={"row"}>
                    <div className={"col-md-3"}>
                        <div className={"card-item"}>
                            <span>Toplam Kategori</span>
                            <div>
                                <span>{total.category}</span>
                            </div>
                        </div>
                    </div>

                    <div className={"col-md-3"}>
                        <div className={"card-item"}>
                            <span>Toplam Ürün</span>
                            <div>
                                <span>{total.product}</span>
                            </div>
                        </div>
                    </div>

                    <div className={"col-md-3"}>
                        <div className={"card-item"}>
                            <span>Toplam Tedarikçi | Müşteri</span>
                            <div>
                                <span>{total.supplier}</span>
                            </div>
                        </div>
                    </div>

                    <div className={"col-md-3"}>
                        <div className={"card-item"}>
                            <span>Toplam İşlem</span>
                            <div>
                                <span>{total.stock}</span>
                            </div>
                        </div>
                    </div>
                </div>



                <div className={"row mt-5"}>
                    <div className={"col-md-6"}>
                        <div className={"card-item"}>
                            <span style={{fontWeight:350}}>Stoktaki Ürün Sayısı:</span>
                            <div>
                                <span style={{fontWeight:350}}>{stock.availableProduct}</span>
                            </div>
                        </div>
                    </div>

                    <div className={"col-md-6"}>
                        <div className={"card-item"}>
                            <span style={{fontWeight:350}}>Stokta Olmayan Ürün Sayısı:</span>
                            <div>
                                <span style={{fontWeight:350}}>{stock.unAvailableProduct}</span>
                            </div>
                        </div>
                    </div>
                </div>



                <div className={"row mt-5"}>
                    <div className={"col-md-6"}>
                        <Bar options={options} data={data} />
                    </div>
                    <div className={"col-md-6"}>
                        <Line options={options2} data={data2} />
                    </div>
                </div>

                <br/><br/><br/>

            </div>
        </FrontLayout>
    );
};

export default inject("AuthStore")(observer(Index));
