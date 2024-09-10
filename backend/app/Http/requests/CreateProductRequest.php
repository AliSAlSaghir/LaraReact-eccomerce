<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest {
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
      'name' => 'required|string|max:255',
      'description' => 'required|string',
      'brand_id' => 'required|exists:brands,id',
      'category_id' => 'required|exists:categories,id',
      'color_id' => 'required|array',
      'color_id.*' => 'exists:colors,id',
      'size_id' => 'required|array',
      'size_id.*' => 'exists:sizes,id',
      'images' => 'nullable|array',
      'images.*' => 'file|mimes:jpeg,png,jpg,gif|max:2048',
      'price' => 'required|numeric',
      'total_qty' => 'required|integer',
      'total_sold' => 'nullable|integer',
    ];
  }
}
