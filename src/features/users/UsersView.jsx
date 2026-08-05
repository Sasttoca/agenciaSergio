import React from 'react';
import UserForm from './components/UserForm';
import UserGrid from './components/UserGrid';

const UsersView = () => {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Gestión de Usuarios</h2>
        <p className="text-slate-400 text-sm mt-1">
          Crea nuevas cuentas, administra credenciales, asigna roles y gestiona accesos al sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UserForm />
        </div>
        <div className="lg:col-span-2">
          <UserGrid />
        </div>
      </div>
    </div>
  );
};

export default UsersView;