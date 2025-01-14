<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest {
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
      'products' => 'array',
      'products.*.id' => 'exists:products,id',
      'products.*.quantity' => 'integer|min:1',
      'products.*.color' => 'string|max:255',
      'products.*.size' => 'string|max:255',
    ];
  }
}
