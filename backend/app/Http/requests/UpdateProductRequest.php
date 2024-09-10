<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest {
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
<<<<<<< HEAD
      'name' => 'nullable|string|max:255|unique:products,name,' . $this->product->id,
=======
      'name' => 'nullable|string|max:255',
>>>>>>> 2328c917c133b47c2b57dfc5fe20b6e2ac74a72c
      'description' => 'nullable|string',
      'brand_id' => 'nullable|exists:brands,id',
      'category_id' => 'nullable|exists:categories,id',
      'color_id' => 'nullable|array',
      'color_id.*' => 'exists:colors,id',
      'size_id' => 'nullable|array',
      'size_id.*' => 'exists:sizes,id',
      'images' => 'nullable|array',
      'images.*' => 'file|mimes:jpeg,png,jpg,gif|max:2048',
      'price' => 'nullable|numeric',
      'total_qty' => 'nullable|integer',
      'total_sold' => 'nullable|integer',
    ];
  }
}
