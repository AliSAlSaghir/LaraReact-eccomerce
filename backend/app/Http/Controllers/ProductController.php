<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ProductController extends Controller {
  // Display a listing of the products
  public function index() {
    return response()->json(Product::with(['colors', 'sizes'])->latest()->get());
  }


  // Store a newly created product in storage
  public function store(CreateProductRequest $request) {
    $data = $request->validated();

    $data['user_id'] = auth('api')->user()->id;

    // Handle file uploads
    if ($request->hasFile('images')) {
      $images = [];
      foreach ($request->file('images') as $image) {
        $path = $image->store('images', 'public');
        $images[] = $path;
      }
      $data['images'] = $images;
    } else {
      $data['images'] = [];
    }

    $product = Product::create($data);
    $product->colors()->sync($request->color_id);
    $product->sizes()->sync($request->size_id);

    return response()->json($product);
  }


  // Display the specified product
  public function show(Product $product) {
    // Eager load the related colors and sizes
    $product = $product->load(['colors', 'sizes']);

    return response()->json($product);
  }


  // Update the specified product in storage
  public function update(UpdateProductRequest $request, Product $product) {
    $data = $request->validated();

    $data['user_id'] = auth('api')->user()->id;

    // Handle file uploads if new images are provided
    if ($request->hasFile('images')) {
      // Delete old images from storage
      foreach ($product->images as $oldImage) {
        if (File::exists(storage_path('app/public/' . $oldImage))) {
          File::delete(storage_path('app/public/' . $oldImage));
        }
      }

      // Upload new images and store their paths
      $images = [];
      foreach ($request->file('images') as $image) {
        $path = $image->store('images', 'public');
        $images[] = $path;
      }

      // Update the images field in the data array
      $data['images'] = $images;
    }

    // Update the product with validated data
    $product->update($data);

    // Sync colors and sizes if provided
    if ($request->has('color_id')) {
      $product->colors()->sync($request->color_id);
    }
    if ($request->has('size_id')) {
      $product->sizes()->sync($request->size_id);
    }

    return response()->json($product);
  }

  // Remove the specified product from storage
  public function destroy(Product $product) {
    foreach ($product->images as $image) {
      File::delete(storage_path('app/public/' . $image));
    }
    $product->delete();

    return response()->noContent();
  }
}
