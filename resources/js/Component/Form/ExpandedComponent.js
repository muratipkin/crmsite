import React from "react";


const ExpandedComponent = ({data}) => {
    var content=JSON.stringify(data['text'],null,2);
    if(content==='null')
        content=' Açıklama Yok ';
    return (
        //içeriğin başındaki ve sonundaki " karakterini budamak için substr kullanıldı
        <div dangerouslySetInnerHTML={{__html:"Açıklama: "+content.substr(1,content.length-2)}}/>
    );
};

export default ExpandedComponent;
