<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request){
        $request->validate([
            'name'=>'required|string',
            'email'=>'required|string|email|unique:users',
            'password'=>'required|string|confirmed'
        ]);
        $user=new User([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>md5($request->password)
        ]);
        $user=$user->save();

        //Kaydedilen bilgilerle giriş yapma... Custom Login

        $credentials=['email'=>$request->email,'password'=>$request->password];
        if(!Auth::attempt($credentials)){
            return response()->json([
                'message'=>'Giriş Yapılamadı, Bilgilerinizi Kontrol Ediniz!'
            ],401); //401=Yetkisiz
        }
        $user=$request->user();

        //Token Oluşturma

        $tokenResult=$user->createToken('Personal Access');
        $token=$tokenResult->token;
        if($request->remember_me){
            $token->expires_at=Carbon::now()->addWeeks(1);
        }
        $token->save();

        //Herşey tamamsa, Client tarafına Response döndür

        return response()->json([
            'success'=>true,
            'id'=>$user->id,
            'name'=>$user->name,
            'email'=>$user->email,
            'access_token'=>$tokenResult->accessToken,
            'token_type'=>'Bearer', //bearer=taşıyan
            'expires_at'=>Carbon::parse($tokenResult->token->expires_at)->toDateTimeString()
        ],201); //201=created
    }

    public function login(Request $request){
        $request->validate([
            'email'=>'required|string|email',
            'password'=>'required|string',
            'remember_me'=>'boolean'
        ]);

        //Giriş Yapma

        $credentials=request(['email','password']); //credential=delil
        if(!Auth::attempt($credentials)){
            return response()->json([
                'message'=>'Bilgileriniz Hatalı, Kontrol Ediniz!'
            ],401);
        }

        $user=$request->user();

        //Token Oluşturma

        $tokenResult=$user->createToken('Personal Access Token');
        $token=$tokenResult->token;
        if($request->remember_me){
            $token->expires_at=Carbon::now()->addWeeks(1);
        }
        $token->save();

        //Herşey tamamsa, Client tarafına Response döndür

        return response()->json([
            'success'=>true,
            'id'=>$user->id,
            'name'=>$user->name,
            'email'=>$user->email,
            'access_token'=>$tokenResult->accessToken,
            'token_type'=>'Bearer',
            'expires_at'=>Carbon::parse($tokenResult->token->expires_at)->toDateTimeString()
        ],201);
    }

    public function logout(Request $request){
        $request->user()->token()->revoke(); //revoke=iptal etmek / geri almak

        return response()->json([
            'message'=>'Çıkış Yaptınız!'
        ]);
    }

    public function user(Request $request){
        return response()->json($request->user());
    }

    public function authenticate(Request $request){
        $user=[];
        if(Auth::check()){
            $user=$request->user();
        }
        return response()->json([
            'user'=>$user,
            'isLoggedIn'=>Auth::check()
        ]);
    }
}
