import React,{useState,useEffect} from "react";
import axios from 'axios';
import {inject,observer} from 'mobx-react';
import {useHistory,Link,NavLink} from 'react-router-dom';
import {Container,Navbar,Nav,NavDropdown,Form,FormControl,Button} from 'react-bootstrap'
//import {LinkContainer} from "react-router-bootstrap";//Çalışmadı... Sürüm uyumsuzluğu...

const FrontLayout=(props)=>{
    props.AuthStore.getToken();
    const history=useHistory();
    const [user,setUser]=useState({});
    const [isLoggedIn,setIsLoggedIn]=useState(false);

    useEffect(()=>{
        const token=(props.AuthStore.appState!=null) ? props.AuthStore.appState.user.access_token : null;

        axios.post('/api/authenticate',{},{
            headers:{
                Authorization:'Bearer '+token
            }
        }).then(res=>{
            if(!res.data.isLoggedIn){
                history.push('/login');
            }
            setUser(res.data.user);
            setIsLoggedIn(res.data.isLoggedIn);
        }).catch(e=>{
                history.push('/login');
        });
    },[]);


    const logout=()=>{
        axios.post('/api/logout',{},{
            headers:{
                Authorization:'Bearer '+props.AuthStore.appState.user.access_token
            }
        }).then(res=>{
            //console.log(res);
        }).catch(e=>console.log(e));

        props.AuthStore.removeToken();
        history.push('/login');
    }

    return(
        <>
        <Navbar bg="dark" variant={"dark"} expand="lg" fixed={"sticky"}>
        <Container>
            <Navbar.Brand><Link className={"nav-link"} to="/">EVEREST MERMER</Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Nav
                    className="me-auto my-2 my-lg-0"
                    style={{ maxHeight: '100px' }}
                    navbarScroll
                >
                    <NavLink className={"nav-link"} to="/">Yönetim Paneli</NavLink>
                    <NavLink className={"nav-link"} to="/tedarikciler" activeStyle={{color:'blue',fontWeight:700,textDecoration:'underline'}}>Tedarikçiler & Müşteriler</NavLink>
                    <NavLink className={"nav-link"} to="/kategoriler" activeStyle={{color:'blue',fontWeight:700,textDecoration:'underline'}}>Kategoriler</NavLink>
                    <NavLink className={"nav-link"} to="/urunler" activeStyle={{color:'blue',fontWeight:700,textDecoration:'underline'}}>Ürünler</NavLink>
                    <NavLink className={"nav-link"} to="/stoklar" activeStyle={{color:'blue',fontWeight:700,textDecoration:'underline'}}>Stok</NavLink>
                </Nav>
                <Nav>
                    <NavDropdown menuVariant={"dark"} title={user.name} id="navbarScrollingDropdown">

                    <Link className={"nav-link nav-item"} to="/profil">Profil Düzenle</Link>
                    <NavDropdown.Divider />
                    <NavDropdown.Item className={"nav-link nav-item"} onClick={logout}><h6>Çıkış Yap</h6></NavDropdown.Item>

                    </NavDropdown>
                </Nav>

            </Navbar.Collapse>
        </Container>
        </Navbar>


        <div>{props.children}</div>
        </>
    );
}
export default inject("AuthStore")(observer(FrontLayout));

{/*<Form className="d-flex">
    <FormControl
        type="search"
        placeholder="Search"
        className="me-2"
        aria-label="Search"
    />
    <Button variant="outline-success">Search</Button>
</Form>*/}
