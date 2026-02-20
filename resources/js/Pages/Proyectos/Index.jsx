import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import datosExternos from '../../proyectos_iniciales.json';

export default function Index({ auth, proyectos }) {
    // 1. ESTADOS (Sin el }; que sobraba)
    const [editandoId, setEditandoId] = useState(null);
    const [sentidoOrden, setSentidoOrden] = useState('asc');

    // 2. FORMULARIO
    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        nombre: '',
        cliente: '',
        descripcion: '',
        fecha_entrega: '',
        presupuesto: '',
        prioridad: 'Media',
    });

    // 3. LÓGICA DE ORDENADO (Usando una copia de los proyectos)
    const proyectosOrdenados = [...proyectos].sort((a, b) => {
        if (!a.fecha_entrega) return 1;
        if (!b.fecha_entrega) return -1;

        const fechaA = new Date(a.fecha_entrega);
        const fechaB = new Date(b.fecha_entrega);

        return sentidoOrden === 'asc' ? fechaA - fechaB : fechaB - fechaA;
    });

    // 4. FUNCIONES
    const toggleOrden = () => {
        setSentidoOrden(sentidoOrden === 'asc' ? 'desc' : 'asc');
    };

    const cargarDesdeJSON = () => {
        const proy = datosExternos[Math.floor(Math.random() * datosExternos.length)];
        setData({
            nombre: proy.nombre,
            cliente: proy.cliente,
            descripcion: proy.descripcion,
            fecha_entrega: proy.fecha_entrega,
            presupuesto: proy.presupuesto,
            prioridad: proy.prioridad,
        });
    };

    const enviar = (e) => {
        e.preventDefault();
        if (editandoId) {
            patch(route('proyectos.update', editandoId), { onSuccess: () => cancelarEdicion() });
        } else {
            post(route('proyectos.store'), { onSuccess: () => reset() });
        }
    };

    const prepararEdicion = (p) => {
        setEditandoId(p.id);
        setData({
            nombre: p.nombre,
            cliente: p.cliente || '',
            descripcion: p.descripcion || '',
            fecha_entrega: p.fecha_entrega || '',
            presupuesto: p.presupuesto || '',
            prioridad: p.prioridad || 'Media',
        });
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
        reset();
        clearErrors();
    };

    // 5. RENDERIZADO (JSX)
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Administración de Proyectos</h2>}
        >
            <Head title="Proyectos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* SECCIÓN DEL FORMULARIO */}
                    <div className="bg-white p-6 shadow rounded-lg mb-8 border border-gray-200">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold text-gray-700">{editandoId ? 'Editar Registro' : 'Nuevo Registro'}</h3>
                            <button onClick={cargarDesdeJSON} type="button" className="text-xs bg-gray-100 border px-2 py-1 rounded hover:bg-gray-200">
                                📥 Cargar de JSON
                            </button>
                        </div>
                        <form onSubmit={enviar} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" placeholder="Proyecto" className="border-gray-300 rounded" value={data.nombre} onChange={e => setData('nombre', e.target.value)} />
                            <input type="text" placeholder="Cliente" className="border-gray-300 rounded" value={data.cliente} onChange={e => setData('cliente', e.target.value)} />
                            <input type="date" className="border-gray-300 rounded" value={data.fecha_entrega} onChange={e => setData('fecha_entrega', e.target.value)} />
                            <input type="number" placeholder="Presupuesto" className="border-gray-300 rounded" value={data.presupuesto} onChange={e => setData('presupuesto', e.target.value)} />
                            <select className="border-gray-300 rounded" value={data.prioridad} onChange={e => setData('prioridad', e.target.value)}>
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                            </select>
                            <input type="text" placeholder="Descripción" className="border-gray-300 rounded" value={data.descripcion} onChange={e => setData('descripcion', e.target.value)} />

                            <div className="md:col-span-3 flex gap-2">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold">
                                    {editandoId ? 'Actualizar' : 'Guardar'}
                                </button>
                                {editandoId && (
                                    <button type="button" onClick={cancelarEdicion} className="bg-gray-400 text-white px-4 py-2 rounded">
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* SECCIÓN DE LA TABLA */}
                    <div className="bg-white shadow rounded-lg overflow-x-auto border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3 text-left">Nombre</th>
                                <th className="px-6 py-3 text-left">Cliente</th>
                                <th className="px-6 py-3 text-left">Presupuesto</th>
                                <th className="px-6 py-3 text-left">Prioridad</th>
                                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition select-none" onClick={toggleOrden}>
                                    <div className="flex items-center gap-2">
                                        <span>Entrega</span>
                                        <div className="flex flex-col text-[10px]">
                                            <span className={sentidoOrden === 'asc' ? 'text-blue-600' : 'text-gray-300'}>▲</span>
                                            <span className={sentidoOrden === 'desc' ? 'text-blue-600' : 'text-gray-300'}>▼</span>
                                        </div>
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                            {proyectosOrdenados.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-900">{p.nombre}</td>
                                    <td className="px-6 py-4 text-gray-600">{p.cliente || '-'}</td>
                                    <td className="px-6 py-4 font-mono text-green-600 font-semibold">{p.presupuesto ? `${p.presupuesto}€` : '-'}</td>
                                    <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs text-white ${p.prioridad === 'Alta' ? 'bg-red-500' : p.prioridad === 'Media' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                                                {p.prioridad}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{p.fecha_entrega ? new Date(p.fecha_entrega).toLocaleDateString() : '-'}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => prepararEdicion(p)} className="text-amber-600 hover:text-amber-900 font-bold">Modificar</button>
                                        <button
                                            onClick={() => confirm('¿Borrar?') && router.delete(route('proyectos.destroy', p.id))}
                                            className="text-red-600 hover:text-red-900 font-bold"
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
