import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Panel de Control
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <p className="mb-4">¡Has iniciado sesión correctamente!</p>

                            {/* BOTÓN HACIA PROYECTOS */}
                            <Link
                                href={route('proyectos.index')}
                                className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white font-bold hover:bg-blue-700 transition"
                            >
                                Gestionar mis Proyectos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
