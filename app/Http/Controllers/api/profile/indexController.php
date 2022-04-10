<?php

namespace App\Http\Controllers\api\profile;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Helper\fileUpload;
use Illuminate\Support\Facades\Log;

class indexController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user=request()->user();
        return response()->json([
            'success'=>true,
            'user'=>$user
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user=request()->user();
        $all=request()->all();
        if($all['email']=='' || $all['email']==null){
            return response()->json([
                'success'=>false,
                'message'=>'Email Adresi Boş Olamaz!'
            ]);
        }

        if($all['email'] != $user->email){
            $control=User::where('email',$all['email'])->count();
            if($control!=0){
                return response()->json([
                    'success'=>false,
                    'message'=>'Bu Email Adresiyle Kayıtlı, Başka Bir Kullanıcı Mevcuttur!'
                ]);
            }
        }

        if($all['password']!='' && $all['password']!=null){
            $all['password']= md5($all['password']);
        } else {
            unset($all['password']);
        }

        $all['photo']=fileUpload::changeUpload(rand(1,9000),'photo',$request->file('image'),0,$user,'photo');
        unset($all['_method']);
        unset($all['image']);
        User::where('id',$user->id)->update($all);
        $user->name=$all['name'];
        $user->email=$all['email'];
        $user->photo=$all['photo'];

        return response([
            'success'=>true,
            'message'=>'Profil Bilgileriniz Başarıyla Güncellendi!',
            'user'=>$user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
