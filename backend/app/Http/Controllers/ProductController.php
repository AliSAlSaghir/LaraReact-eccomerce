<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Color;
use App\Models\Product;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ProductController extends Controller {
  // Display a listing of the products
  public function index(Request $request) {
    // Get query parameters
    $name = $request->query('name');
    $categoryName = $request->query('category');
    $brandName = $request->query('brand');
    $colorNames = $request->query('colors');
    $sizeNames = $request->query('sizes');
    $priceRange = $request->query('price');

    // Build query
    $query = Product::latest();

    // Apply filters
    if ($name) {
      $query->where('name', 'like', '%' . $name . '%');
    }
    if ($categoryName) {
      $query->whereHas('category', function ($q) use ($categoryName) {
        $q->where('name', $categoryName);
      });
    }
    if ($brandName) {
      $query->whereHas('brand', function ($q) use ($brandName) {
        $q->where('name', $brandName);
      });
    }
    if ($colorNames) {
      $colorsArray = explode(',', $colorNames);
      $query->whereHas('colors', function ($q) use ($colorsArray) {
        $q->whereIn('name', $colorsArray);
      });
    }
    if ($sizeNames) {
      $sizesArray = explode(',', $sizeNames);
      $query->whereHas('sizes', function ($q) use ($sizesArray) {
        $q->whereIn('name', $sizesArray);
      });
    }
    if ($priceRange) {
      // Split the price range into min and max values
      $priceParts = explode('-', $priceRange);
      if (count($priceParts) == 2) {
        $minPrice = (float)$priceParts[0];
        $maxPrice = (float)$priceParts[1];
        $query->whereBetween('price', [$minPrice, $maxPrice]);
      }
    }

    // Paginate results
    $products = $query->paginate(10);

    return ProductResource::collection($products)
      ->additional([
        'colors' => Color::has('products')->get()->map(fn($color) => $color->name),
        'sizes' => Size::has('products')->get()->map(fn($size) => $size->name),
      ]);
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
        $images[] = 'storage/' . $path;
      }
      $data['images'] = $images;
    } else {
      $data['images'] = [];
    }


    $product = Product::create($data);
    $product->colors()->sync($request->color_id);
    $product->sizes()->sync($request->size_id);

    return ProductResource::make($product);
  }


  // Display the specified product
  public function show(Product $product) {
    return ProductResource::make($product);
  }


  // Update the specified product in storage
  public function update(UpdateProductRequest $request, Product $product) {

    $data = $request->validated();


    $data['user_id'] = auth('api')->user()->id;

    // Handle file uploads if new images are provided
    if ($request->hasFile('images')) {
      $request->validate([
        'images.*' => 'mimes:jpeg,png,jpg,gif|max:2048',
      ]);
      // Delete old images from storage
      foreach ($product->images as $oldImage) {
        // Remove the 'storage/' prefix to get the actual path
        $oldImagePath = str_replace('storage/', '', $oldImage);

        if (File::exists(storage_path('app/public/' . $oldImagePath))) {
          File::delete(storage_path('app/public/' . $oldImagePath));
        }
      }

      // Upload new images and store their paths
      $images = [];
      foreach ($request->file('images') as $image) {
        $path = $image->store('images', 'public');
        // Prepend 'storage/' to the path
        $images[] = 'storage/' . $path;
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

    return ProductResource::make($product);
  }

  // Remove the specified product from storage
  public function destroy(Product $product) {
    foreach ($product->images as $image) {
      $imagePath = str_replace('storage/', '', $image);

      // Delete the old image from storage
      if (File::exists(storage_path('app/public/' . $imagePath))) {
        File::delete(storage_path('app/public/' . $imagePath));
      }
    }


    $product->colors()->detach();
    $product->sizes()->detach();
    $product->delete();

    return response()->noContent();
  }
}
