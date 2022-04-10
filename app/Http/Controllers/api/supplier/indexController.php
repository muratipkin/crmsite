<?php

namespace App\Http\Controllers\api\supplier;

use App\Http\Controllers\Controller;
use App\Models\Stock;
use App\Models\Supplier;
use Illuminate\Http\Request;
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
        $suppliers= Supplier::where('userId',$user->id)->get();
        return response()->json([
            'success'=>true,
            'data'=>$suppliers
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
        $user= request()->user();
        $all= $request->all();
        $all['userId']=$user->id;
        //Log::info(json_encode($all)); //Veriyi laravel.log dosyasına basma (Hata Yönetimi İçin)
        $create= Supplier::create($all);
        if($create){
            return response()->json(['success'=>true,'message'=>'Tedarikçi | Müşteri Başarıyla Eklendi!']);
        } else {
            return response()->json(['success'=>false,'message'=>'Tedarikçi | Müşteri Eklenemedi!']);
        }
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
        $user= request()->user();
        $control= Supplier::where('userId',$user->id)->where('id',$id)->count();
        if($control==0){
            return response()->json(['success'=>false,'message'=>'Tedarikçi | Müşteri, size ait olmadığı için düzenleyemezsiniz!']);
        }
        $supplier= Supplier::where('id',$id)->first();
        return response()->json(['success'=>true,'supplier'=>$supplier]);
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
        $user= request()->user();
        $control= Supplier::where('userId',$user->id)->where('id',$id)->count();
        if($control==0){
            return response()->json(['success'=>false,'message'=>'Tedarikçi | Müşteri, size ait olmadığı için düzenleyemezsiniz!']);
        }
        $all=$request->all();
        unset($all['_method']); //Veritabanında olmayan alanı sildik
        $update= Supplier::where('id',$id)->update($all);
        if($update){
            return response()->json(['success'=>true,'message'=>'Tedarikçi | Müşteri Başarıyla Düzenlendi!']);
        } else {
            return response()->json(['success'=>false,'message'=>'Tedarikçi | Müşteri Düzenlenemedi!']);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user= request()->user();
        $control= Supplier::where('userId',$user->id)->where('id',$id)->count();
        if($control==0){
            return response()->json(['success'=>false,'message'=>'Tedarikçi | Müşteri, size ait olmadığı için silemezsiniz!']);
        }

        $stockControl=Stock::where('userId',$user->id)->where('supplierId',$id)->count();
        if($stockControl>0){
            return response()->json(['success'=>false,'message'=>' Bu Tedarikçi | Müşteri\'ye ait, Stok Kaydı olduğu için silemezsiniz! Önce, ilgili Stok Kaydını silmeniz gerekir!']);
        }

        Supplier::where('id',$id)->delete();
        return response()->json(['success'=>true,'message'=>'Tedarikçi | Müşteri, Başarıyla Silindi!']);
    }
}
