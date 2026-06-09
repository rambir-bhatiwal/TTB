<?php
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;

Route::get('/', function () {
    // return view('welcome');
        // return Inertia::render('Home');
    return Inertia::render('Auth/Login');
});
 
Route::get('/login', function() {
    return Inertia::render('Auth/Login');
});

Route::post('/login', [LoginController::class, 'store']);

// Route::post('/login', function() {
    // $validation = request()->validate([
    //     'email' => ['required', 'email','min:10'],
    //     'password' => 'required|min:6'
    // ]);

    // dd($validation['email']);
    //dd(request()->all());
   // return Inertia::render('Auth/Login');
// });


Route::get('/debug-test', function () {
    $arr= ['maruu', 'yash', 'satyarth',  'pratham', 'satyarth', 'yash', 'maruu', 'pratham', 'satyarth', 'yash', 'maruu', 'pratham'];
    $name = $arr[array_rand($arr)];

    $age = rand(20, 30);
    $ctt = ['Yamunanagar', 'Ambala', 'Panchkula', 'Chandigarh', 'Delhi', 'Gurugram', 'Faridabad'];
    $city = $ctt[array_rand($ctt)];
    $hobbies = ['coding', 'gaming', 'traveling', 'cooking', 'sports'];
    $hobby = $hobbies[array_rand($hobbies)];
    $languages = ['PHP', 'JavaScript', 'Python', 'Java', 'C#'];
    $language = $languages[array_rand($languages)];

    $pets = ['dog', 'cat', 'hamster', 'rabbit', 'fish'];
    $pet = $pets[array_rand($pets)];

    dd(createRandomUserData());

    dd( json_encode(['name' => $name, 'age' => $age, 'city' => $city , 'hobby' => $hobby, 'language' => $language, 'pet' => $pet]) );

});



function createRandomUserData() {
    $arr= ['maruu', 'yash', 'satyarth',  'pratham', 'satyarth', 'yash', 'maruu', 'pratham', 'satyarth', 'yash', 'maruu', 'pratham'];
    $name = $arr[array_rand($arr)];

    $age = rand(20, 30);
    $ctt = ['Yamunanagar', 'Ambala', 'Panchkula', 'Chandigarh', 'Delhi', 'Gurugram', 'Faridabad'];
    $city = $ctt[array_rand($ctt)];
    $hobbies = ['coding', 'gaming', 'traveling', 'cooking', 'sports'];
    $hobby = $hobbies[array_rand($hobbies)];
    $languages = ['PHP', 'JavaScript', 'Python', 'Java', 'C#'];
    $language = $languages[array_rand($languages)];

    $pets = ['dog', 'cat', 'hamster', 'rabbit', 'fish'];
    $pet = $pets[array_rand($pets)];

    return json_encode(['name' => $name, 'age' => $age, 'city' => $city , 'hobby' => $hobby, 'language' => $language, 'pet' => $pet]);
}