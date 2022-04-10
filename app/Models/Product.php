<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $guarded=[];

    public function properties(){
        return $this->hasMany(ProductProperty::class,'productId','id');
    }

    public function images(){
        return $this->hasMany(ProductImage::class,'productId','id');
    }
}
