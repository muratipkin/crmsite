import {observable,makeAutoObservable,action} from "mobx";
import JwtDecode from "jwt-decode";
import JwtEncode from "jwt-encode";
import CryptoJs from "crypto-js";

class AuthStore{
    appState=null;
    constructor() {
        makeAutoObservable(this,{
            appState:observable,
            saveToken:action,
            getToken:action
        });
    }

    saveToken=(appState)=>{
        try
        {
            localStorage.setItem('appState',CryptoJs.AES.encrypt(JwtEncode(appState,'secret'),'udemy-laravel-js').toString());
            this.getToken();
        }
        catch (e)
        {
            console.log(e);
        }
    }

    getToken=()=>{
        try
        {
            const appStateData=localStorage.getItem('appState');
            if(appStateData){
                let bytes=CryptoJs.AES.decrypt(appStateData,'udemy-laravel-js');
                let originalText=bytes.toString(CryptoJs.enc.Utf8);
                this.appState=JwtDecode(originalText);
            }
            else{
                this.appState=null;
            }
        }
        catch (e)
        {
            console.log(e);
        }
    }

    removeToken=()=>{
        localStorage.removeItem("appState");
        this.appState=null;
    }
}
export default new AuthStore();
