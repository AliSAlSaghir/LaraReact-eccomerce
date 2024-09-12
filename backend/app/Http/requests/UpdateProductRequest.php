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
      'name' => 'string|max:255|unique:products,name,' . $this->product->id,
      'description' => 'string',
      'brand_id' => 'exists:brands,id',
      'category_id' => 'exists:categories,id',
      'color_id' => 'array',
      'color_id.*' => 'exists:colors,id',
      'size_id' => 'array',
      'size_id.*' => 'exists:sizes,id',
      'images' => 'array',
      'images.*' => 'file|mimes:jpeg,png,jpg,gif|max:2048',
      'price' => 'numeric',
      'total_qty' => 'integer',
      'total_sold' => 'integer',
    ];
  }
}
