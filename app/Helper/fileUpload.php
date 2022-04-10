<?php
namespace App\Helper;

use Illuminate\Support\Facades\Log;
use Image;
use Illuminate\Support\Facades\File;
class fileUpload{
    static function newUpload($name,$directory,$file,$type=0){
        $dir='files/'.$directory.'/'.$name;
        if(!empty($file)){
            if(!File::exists($dir)){
                File::makeDirectory($dir,0755,true);
            }
            $filename=rand(1,900000).'.'.$file->getClientOriginalExtension();
            if($type==0){
                $path=public_path($dir.'/'.$filename);
                Image::make($file->getRealPath())->save($path);
            }
            else{
                $path=public_path($dir.'/');
                $file->move($path,$filename);
            }
            return $dir.'/'.$filename;
        }
        else
        {
            return '';
        }
    }



    static function changeUpload($name,$directory,$file,$type=0,$data,$field){
        $dir='files/'.$directory.'/'.$name;
        if(!empty($file)){
            if(!File::exists($dir)){
                File::makeDirectory($dir,0755,true);
            }
            $filename=rand(1,900000).'.'.$file->getClientOriginalExtension();
            if($type==0){
                $path=public_path($dir.'/'.$filename);
                Image::make($file->getRealPath())->save($path);
            }
            else{
                $path=public_path($dir.'/');
                $file->move($path,$filename);
            }
            if($data->{$field}!=null){
                if(public_path($data->{$field})!=null){
                    try{
                        unlink(public_path($data->{$field}));

                        $fullPath=explode('/',$data->{$field});
                        $count=count($fullPath);
                        $directoryPathArray=array_splice($fullPath,0,$count-1);
                        $directoryPath=implode('/',$directoryPathArray);
                        rmdir(public_path($directoryPath));
                    }catch (Exception $e){}
                }
            }
            return $dir.'/'.$filename;
        }
        else
        {
            return $data->{$field};
        }
    }
}
