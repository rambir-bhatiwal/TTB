<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email|min:10',
            'password' => ['required', 'min:6']

        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'eEmail is required',
            'email.email' => 'eEmail must be a valid email address',
            'email.min' => 'eEmail must be at least 10 characters',
            'password.required' => 'pPassword is required',
            'password.min' => 'pPassword must be at least 6 characters'
        ];
    }
}
