import React from "react";
import {Route,Switch} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

//Sayfalar
import FrontIndex from "./Views/Index";
import FrontLogin from "./Views/Login";
import FrontRegister from "./Views/Register";
//Ürünler
import ProductIndex from "./Views/Product/index";
import ProductCreate from "./Views/Product/create";
import ProductEdit from "./Views/Product/edit";
//Kategoriler
import CategoryIndex from "./Views/Category/index";
import CategoryCreate from "./Views/Category/create";
import CategoryEdit from "./Views/Category/edit";
//Tedarikçiler
import SupplierIndex from "./Views/Supplier/index";
import SupplierCreate from "./Views/Supplier/create";
import SupplierEdit from "./Views/Supplier/edit";
//Stoklar
import StockIndex from "./Views/Stock/index";
import StockCreate from "./Views/Stock/create";
import StockEdit from "./Views/Stock/edit";
//Profil
import ProfileIndex from "./Views/Profile/index";


const Main=()=>(//Süslü parantez yerine normal parantez, return anlamına gelir.
    <Switch>{//Bu komut için react-router-dom v5.2.0 kurulmalı. Yeni sürümlerde çalışmıyor.
        }
        <PrivateRoute path="/" exact component={FrontIndex} />
        <Route path="/login" component={FrontLogin} />
        <Route path="/register" component={FrontRegister} />

        <PrivateRoute path="/urunler" exact component={ProductIndex} />
        <PrivateRoute path="/urun/ekle" component={ProductCreate} />
        <PrivateRoute path="/urun/duzenle/:id" component={ProductEdit} />

        <PrivateRoute path="/kategoriler" exact component={CategoryIndex} />
        <PrivateRoute path="/kategori/ekle" component={CategoryCreate} />
        <PrivateRoute path="/kategori/duzenle/:id" component={CategoryEdit} />

        <PrivateRoute path="/tedarikciler" exact component={SupplierIndex} />
        <PrivateRoute path="/tedarikci/ekle" component={SupplierCreate} />
        <PrivateRoute path="/tedarikci/duzenle/:id" component={SupplierEdit} />

        <PrivateRoute path="/stoklar" exact component={StockIndex} />
        <PrivateRoute path="/stok/ekle" component={StockCreate} />
        <PrivateRoute path="/stok/duzenle/:id" component={StockEdit} />

        <PrivateRoute path="/profil" exact component={ProfileIndex} />
    </Switch>
);
export default Main;
