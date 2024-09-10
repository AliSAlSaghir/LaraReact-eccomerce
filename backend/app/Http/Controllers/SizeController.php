<?php

namespace App\Http\Controllers;

use App\Models\Size;
use Illuminate\Http\Request;

class SizeController extends Controller {
  /**
   * Display a listing of the resource.
   */
  public function index() {
    return response()->json(Size::latest()->get());
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request) {
    $request->validate([
      'name' => 'required|max:255|unique:sizes',
    ]);
    $size = Size::create($request->all());
    return response()->json($size);
  }

  /**
   * Display the specified resource.
   */
  public function show(Size $size) {
    return response()->json($size);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Size $size) {
    $request->validate([
      'name' => 'required|max:255|unique:sizes,name,' . $size->id,
    ]);
    $size->update($request->all());
    return response()->json($size);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Size $size) {
    $size->delete();
    return response()->noContent();
  }
}
