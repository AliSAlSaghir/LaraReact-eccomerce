<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest {
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array {
    return [
      'payment_method' => 'required|string',
      'currency' => 'required|string|max:3',
      'products' => 'required|array',
      'products.*.id' => 'exists:products,id',
      'products.*.quantity' => 'required|integer|min:1',
    ];
  }
}
