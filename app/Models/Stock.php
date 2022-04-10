<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    const ENTRY=0;
    const OUT=1;
    use HasFactory;
    protected $guarded=[];
    protected $appends=['stockTypeString'];

    public function getStockTypeStringAttribute(){
        switch ($this->attributes['stockType']){
            case self::ENTRY:
                return 'Stoka Ekleme';
                break;
            case self::OUT:
                return 'Stoktan Çıkarma';
                break;
        }
    }

    public function supplier(){
        return $this->hasOne(Supplier::class,'id','supplierId');
    }

    public function product(){
        return $this->hasOne(Product::class,'id','productId');
    }
}
