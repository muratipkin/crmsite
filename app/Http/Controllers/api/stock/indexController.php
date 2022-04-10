<?php

namespace App\Http\Controllers\api\stock;

use App\Http\Controllers\Controller;
use App\Models\Product;
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
        $stocks=Stock::where('userId',$user->id)->with('supplier')->with('product')->get();
        return response([
            'success'=>true,
            'data'=>$stocks
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $user=request()->user();
        $products=Product::where('userId',$user->id)->get();
        $stockTypes=[['id'=>Stock::ENTRY,'name'=>'Ekle'],['id'=>Stock::OUT,'name'=>'Çıkar']];
        return response([
            'success'=>true,
            'products'=>$products,
            'stockTypes'=>$stockTypes
        ]);
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

        if($all['isStock']){


            if($all['stockType']==Stock::ENTRY){
                $create= Stock::create($all);
                if($create){
                    Product::where('userId',$user->id)->where('id',$all['productId'])->increment('stock',$all['quantity']);
                    return response()->json(['success'=>true,'message'=>'İlgili Ürün İçin Stok Ekleme İşlemi, Başarıyla Gerçekleştirildi!']);
                }
                return response()->json(['success'=>false,'message'=>'Stok Kaydı Oluşturulamadı!']);
            }


            if($all['stockType']==Stock::OUT){
                $product=Product::where('userId',$user->id)->where('id',$all['productId'])->get();
                if($product[0]->stock>=$all['quantity']){
                    $create= Stock::create($all);
                    if($create) {
                        Product::where('userId', $user->id)->where('id', $all['productId'])->decrement('stock', $all['quantity']);
                        return response()->json(['success' => true, 'message' => 'İlgili Ürün İçin Stoktan Çıkarma İşlemi, Başarıyla Gerçekleştirildi!']);
                    }
                    return response()->json(['success'=>false,'message'=>'Stok Kaydı Oluşturulamadı!']);
                } else {
                    return response()->json(['success'=>false,'message'=>'Yeterli Miktarda Ürün Olmadığı İçin Stoktan Çıkarma İşlemi Gerçekleştirilemedi!']);
                }
            }
        }


        $create= Stock::create($all);
        if($create) {
            return response()->json(['success' => true, 'message' => 'Stok Kaydı, Başarıyla Oluşturuldu!']);
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
        $control= Stock::where('userId',$user->id)->where('id',$id)->count();
        if($control==0){
            return response()->json(['success'=>false,'message'=>'Stok, size ait olmadığı için düzenleyemezsiniz!']);
        }
        $data= Stock::where('id',$id)->first();
        $suppliers= Supplier::where('userId',$user->id)->where('supplierType',$data->stockType)->get();
        $products=Product::where('userId',$user->id)->get();
        $stockTypes=[['id'=>Stock::ENTRY,'name'=>'Ekle'],['id'=>Stock::OUT,'name'=>'Çıkar']];
        return response()->json([
            'success'=>true,
            'products'=>$products,
            'stockTypes'=>$stockTypes,
            'suppliers'=>$suppliers,
            'data'=>$data
        ]);
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
        $all= $request->all();
        unset($all['_method']); //Veritabanında olmayan alanı sildik
        //Log::info(json_encode($all)); //Veriyi laravel.log dosyasına basma (Hata Yönetimi İçin)

        $control= Stock::where('userId',$user->id)->where('id',$id)->count();
        if($control==0){
            return response()->json(['success'=>false,'message'=>'Stok, size ait olmadığı için düzenleyemezsiniz!']);
        }
        $data= Stock::where('id',$id)->first();

        if($all['isStock']) {


            if ($all['stockType'] == Stock::ENTRY) {
                $update = Stock::where('id', $id)->update($all);
                if ($update) {
                    if ($all['quantity'] != $data->quantity) {
                        $inc = ($all['quantity'] > $data->quantity) ? $all['quantity'] - $data->quantity : 0;
                        if ($inc > 0) {
                            Product::where('userId', $user->id)->where('id', $all['productId'])->increment('stock', $inc);
                            return response()->json(['success' => true, 'message' => 'Stok Kaydı Düzenlendi ve Stok Miktarı Artırıldı!']);
                        }
                        $dec = ($data->quantity > $all['quantity']) ? $data->quantity - $all['quantity'] : 0;
                        Product::where('userId', $user->id)->where('id', $all['productId'])->decrement('stock', $dec);
                        return response()->json(['success' => true, 'message' => 'Stok Kaydı Düzenlendi ve Stok Miktarı Azaltıldı!']);
                    }
                    return response()->json(['success' => true, 'message' => 'Stok Kaydı Düzenlendi Ama Stok Miktarı Değişmedi!']);
                }
                return response()->json(['success' => false, 'message' => 'Stok Kaydı Düzenlenemedi!']);
            }


            if ($all['stockType'] == Stock::OUT) {
                $product = Product::where('userId', $user->id)->where('id', $all['productId'])->get();
                if ($all['quantity'] != $data->quantity) {
                    $dec = ($data->quantity < $all['quantity']) ? $all['quantity'] - $data->quantity : 0;
                    if ($dec > 0) {
                        if ($product[0]->stock >= $dec) {
                            $update = Stock::where('id', $id)->update($all);
                            if ($update) {
                                Product::where('userId', $user->id)->where('id', $all['productId'])->decrement('stock', $dec);
                                return response()->json(['success' => true, 'message' => 'Stok Kaydı Düzenlendi ve Stok Miktarı Azaltıldı!']);
                            }
                            return response()->json(['success' => false, 'message' => 'Stok Kaydı Düzenlenemedi!']);
                        }
                        return response()->json(['success' => false, 'message' => 'Yeterli Miktarda Ürün Olmadığı İçin Stok Düzenlenemedi!']);
                    }
                    $inc = ($data->quantity > $all['quantity']) ? $data->quantity - $all['quantity'] : 0;
                    $update = Stock::where('id', $id)->update($all);
                    if($update){
                        Product::where('userId', $user->id)->where('id', $all['productId'])->increment('stock', $inc);
                        return response()->json(['success' => true, 'message' => 'Stok Kaydı Düzenlendi ve Stok Miktarı Artırıldı!']);
                    }
                    return response()->json(['success' => false, 'message' => 'Stok Kaydı Düzenlenemedi!']);
                }
            }
        }


        $update= Stock::where('id',$id)->update($all);
        if($update) {
            return response()->json(['success' => true, 'message' => 'Stok Düzenleme İşlemi, Başarıyla Gerçekleştirildi!']);
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
        $control= Stock::where('userId',$user->id)->where('id',$id)->count();
        if($control==0){
            return response()->json(['success'=>false,'message'=>'Stok, size ait olmadığı için silemezsiniz!']);
        }
        $data= Stock::where('id',$id)->first();

        if($data['isStock']){


            if ($data['stockType'] == Stock::ENTRY) {
                $product=Product::where('id',$data['productId'])->get();
                if($product[0]->stock>=$data['quantity']){
                    Product::where('id', $data['productId'])->decrement('stock', $data->quantity);
                    Stock::where('id',$id)->delete();
                    return response()->json(['success' => true, 'message' => 'Stok Kaydı Silindi ve İlgili Ürünün Stok Miktarı Azaltıldı!']);
                }
                return response()->json(['success' => false, 'message' => 'Daha Önce, STOK ÇIKARMA İŞLEMİ Yapıldığı İçin Stok Kaydı Silinemedi! Önce, Ürüne Ait Stok Çıkarma İşlemini Siliniz!']);
            }


            if ($data['stockType'] == Stock::OUT) {
                Product::where('id', $data['productId'])->increment('stock', $data->quantity);
                Stock::where('id',$id)->delete();
                return response()->json(['success' => true, 'message' => 'Stok Kaydı Silindi ve İlgili Ürünün Stok Miktarı Artırıldı!']);
            }
        }
    }







    public function getSupplier(Request $request){
        $user=request()->user();
        $suppliers=Supplier::where('supplierType',$request->stockType)->get();
        $accountType="Müşteri";
        if($request->stockType == 0)
            $accountType='Tedarikçi';

        return response([
            'success'=>true,
            'suppliers'=>$suppliers,
            'accountType'=>$accountType
        ]);
    }
}
