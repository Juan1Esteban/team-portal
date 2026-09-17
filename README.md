Acceso y Cuentas de Demostración
La aplicación cuenta con un sistema de autenticación basado en Guards funcionales que protegen el enrutamiento.

Cuentas de acceso (Credenciales):

Rol Administrador:

Email: admin@demo.com
Contraseña: admin

Rol Usuario:

Email: user@demo.com
Contraseña: user

¿Cómo inician sesión los usuarios creados desde la aplicación?
Al crear un usuario nuevo desde el panel de Administración (disponible solo para el rol Administrador), se le asignará un email y una contraseña temporal en el formulario de creación. El nuevo usuario solo debe ingresar a la ruta /login, introducir dicho email y contraseña, y el AuthService validará sus credenciales contra el estado global de usuarios. Si el usuario fue marcado como "inactivo" por un administrador, el sistema bloqueará su ingreso inmediatamente.

