<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CategoryController extends Controller {
  /**
   * Display a listing of the resource.
   */
  public function index() {
    return response()->json(Category::with(['products'])->latest()->get());
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

    $category = Category::create([
      'name' => $request->name,
      'image' => $request->file('image')->store('images'),
      'user_id' => $user,
    ]);

    return response()->json($category);
  }


  /**
   * Display the specified resource.
   */
  public function show(Category $category) {
    $category->load('products');

    return response()->json($category);
  }


  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Category $category) {
    $request->validate([
      'name' => [
        'string',
        'max:255',
        Rule::unique('categories', 'name')->ignore($category->id),
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
      if ($category->image && Storage::exists($category->image)) {
        Storage::delete($category->image);
      }

      // Store the new image and prepare for update
      $newImagePath = $request->file('image')->store('images');
      $data['image'] = $newImagePath;
    }

    $data['user_id'] = auth('api')->user()->id;

    // Update the category with the gathered data
    $category->update($data);

    return response()->json($category);
  }



  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Category $category) {
    if ($category->image && Storage::exists($category->image)) {
      Storage::delete($category->image);
    }

    $category->delete();

    return response()->noContent();
  }
}
