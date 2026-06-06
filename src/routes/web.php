<?php
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // return view('welcome');
        // return Inertia::render('Home');
    return Inertia::render('Auth/Login');
});
 
Route::get('/login', function() {
    return Inertia::render('Auth/Login');
});


Route::post('/login', function() {
    $validation = request()->validate([
        'email' => ['required', 'email'],
        'password' => 'required|min:6'
    ]);

    dd($validation['email']);
    //dd(request()->all());
   // return Inertia::render('Auth/Login');
});
