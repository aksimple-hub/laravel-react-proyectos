<?php

namespace App\Http\Controllers;

use App\Models\Proyecto;
use App\Http\Requests\StoreProyectoRequest;
use App\Http\Requests\UpdateProyectoRequest;
use Inertia\Inertia;

class ProyectoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Usamos Inertia para enviar los proyectos a la vista de React
        return Inertia::render('Proyectos/Index', [
            'proyectos' => Proyecto::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProyectoRequest $request)
    {
        //
        Proyecto::create($request->validated());
        return redirect()->route('proyectos.index');

    }

    /**
     * Display the specified resource.
     */
    public function show(Proyecto $proyecto)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Proyecto $proyecto)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProyectoRequest $request, Proyecto $proyecto)
    {

        // Actualiza los datos del proyecto que seleccionaste
        $proyecto->update($request->validated());

        return redirect()->route('proyectos.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Proyecto $proyecto)
    {
        // Borramos el proyecto de la base de datos
        $proyecto->delete();
        // Devolvemos al usuario a la lista
        return redirect()->route('proyectos.index');
    }
}
