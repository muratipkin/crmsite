<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->integer('userId');
            $table->integer('categoryId');
            $table->string('name');
            $table->string('modelCode');
            $table->string('brand');
            $table->string('barcode');
            $table->integer('stock')->default(0);
            $table->string('image')->nullable();
            $table->integer('tax')->default(0);
            $table->double('buyingPrice')->nullable();
            $table->double('sellingPrice')->nullable();
            $table->text('text')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
