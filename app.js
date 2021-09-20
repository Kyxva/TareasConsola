require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoBorrarTareas, confirmar, mostrarCheckList } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');



const main = async() => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if ( tareasDB ) {   // Cargar tareas
        tareas.cargarTareasFromArray( tareasDB );
    }

    do {

        opt = await inquirerMenu();
        
        switch ( opt ) {
            case '1':   // Crear tarea
                const desc = await leerInput('Descripción:');
                tareas.crearTarea( desc );
            break;

            case '2':   // Listado de tareas
                tareas.listadoCompleto();
            break;

            case '3':   // Listar tareas completadas
                tareas.listarCompletadasPendientes( true );
            break;

            case '4':   // Listar tareas pendientes
                tareas.listarCompletadasPendientes( false );
            break;
            
            case '5':   // Completado | Pendiente
                const ids = await mostrarCheckList( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
            break;

            case '6':   // Borrar tarea
                const id = await listadoBorrarTareas( tareas.listadoArr );
                if ( id !== '0' ) {
                    const ok = await confirmar('¿Está seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada');
                    }
                }
            break;
        }

        guardarDB( tareas.listadoArr );

        await pausa();

    } while ( opt !== '0' );

}

main();