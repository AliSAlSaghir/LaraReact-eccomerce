<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class BrandController extends Controller {
  /**
   * Display a listing of the resource.
   */
  public function index() {
    return response()->json(Brand::latest()->get());
  }


  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request) {
    // return $request;
    // Validate the request
    $request->validate([
      'name' => 'required|string|max:255|unique:categories,name',
      'image' => 'required|file|mimes:jpeg,png,jpg,gif|max:2048'
    ]);

    $user = auth('api')->user()->id;

    $brand = Brand::create([
      'name' => $request->name,
      'image' => $request->file('image')->store('images'),
      'user_id' => $user,
    ]);

    return response()->json($brand);
  }


  /**
   * Display the specified resource.
   */
  public function show(Brand $brand) {
    return response()->json($brand);
  }


  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Brand $brand) {
    $request->validate([
      'name' => [
        'string',
        'max:255',
        Rule::unique('categories', 'name')->ignore($brand->id),
      ],
      'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $data = [];

    // Check if 'name' is present in the request before updating
    if ($request->has('name')) {
      $data['name'] = $request->name;
    }

    // Handle image update
    if ($request->hasFile('image')) {
      // Delete the old image if it exists
      if ($brand->image && Storage::exists($brand->image)) {
        Storage::delete($brand->image);
      }

      // Store the new image and prepare for update
      $newImagePath = $request->file('image')->store('images');
      $data['image'] = $newImagePath;
    }

    $data['user_id'] = auth('api')->user()->id;

    // Update the brand with the gathered data
    $brand->update($data);

    return response()->json($brand);
  }



  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Brand $brand) {
    if ($brand->image && Storage::exists($brand->image)) {
      Storage::delete($brand->image);
    }

    $brand->delete();

    return response()->noContent();
  }
}
