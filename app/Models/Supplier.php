<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;
    const TYPE_SUPPLIER=0;
    const TYPE_CUSTOMER=1;
    protected $appends=['supplierTypeString'];
    protected $fillable= ['userId','supplierType','name','phone','email','address','note'];

    public function getSupplierTypeStringAttribute(){
        switch ($this->attributes['supplierType']){
            case self::TYPE_SUPPLIER:
                return 'Tedarikçi';
                break;
            case self::TYPE_CUSTOMER:
                return 'Müşteri';
                break;
        }
    }
}
