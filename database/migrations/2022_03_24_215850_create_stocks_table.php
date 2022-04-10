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
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->integer('userId');
            $table->integer('stockType');
            $table->integer('supplierId');
            $table->integer('productId');
            $table->integer('quantity')->default(0);
            $table->double('totalPrice')->nullable();
            $table->date('date');
            $table->text('text');
            $table->integer('isStock');
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
        Schema::dropIfExists('stocks');
    }
};
