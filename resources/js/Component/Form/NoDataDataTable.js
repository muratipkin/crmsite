import React from "react";


const NoDataDataTable = () => {
    return (
        <div dangerouslySetInnerHTML={{__html:"<br/>Görüntülenecek Herhangi Bir Kayıt Bulunamadı!<br/><br/>"}}/>
    );
};

export default NoDataDataTable;
