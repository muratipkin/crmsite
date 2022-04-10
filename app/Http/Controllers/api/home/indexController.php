<?php

namespace App\Http\Controllers\api\home;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Stock;

class indexController extends Controller
{
    public function index(Request $request){
        $user= request()->user();
        $totolCategory= Category::where('userId',$user->id)->count();
        $totolProduct= Product::where('userId',$user->id)->count();
        $totolSupplier= Supplier::where('userId',$user->id)->count();
        $totolStock= Stock::where('userId',$user->id)->count();
        $total=[
            'category'=>$totolCategory,
            'product'=>$totolProduct,
            'supplier'=>$totolSupplier,
            'stock'=>$totolStock
        ];

        $availableProduct= Product::where('userId',$user->id)->where('stock','>',0)->count();
        $unAvailableProduct= Product::where('userId',$user->id)->where('stock',0)->count();
        $stock=[
            'availableProduct'=>$availableProduct,
            'unAvailableProduct'=>$unAvailableProduct,
        ];

        $chartStock= Product::where('userId',$user->id)->limit(7)->select(['id','modelCode','stock'])->orderBy('stock','desc')->get();

        $dailyTransaction=[];
        for($i=6;$i>=0;$i--){
            $date= date('Y-m-d',strtotime('- '.$i.' Day',time()));
            $dailyTransaction[]= [$date, Stock::where('userId',$user->id)->where('date',$date)->sum('quantity')];
        }

        return response()->json([
            'success'=>true,
            'total'=>$total,
            'stock'=>$stock,
            'chartStock'=>$chartStock,
            'dailyTransaction'=>$dailyTransaction
        ]);
    }
}
