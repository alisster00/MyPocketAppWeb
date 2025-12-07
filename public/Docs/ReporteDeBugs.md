🐞 1. Registro de Bugs

🐛Plantilla Rápida de Bug (COPIAR Y PEGAR)

BUG-000 [ESTADO: PENDIENTE] Nombre o Usuario

Fecha: [YYYY-MM-DD]
Módulo: [Ej: Auth / Dashboard / API-X]
Título: Breve resumen del error.
Pasos para Reproducir:

[Paso 1]

[Paso 2]

[Paso 3]

Esperado: [Comportamiento correcto esperado.]

Actual: [Comportamiento incorrecto actual.]

Severidad: [CRÍTICO / MAYOR / MENOR]

Reportes Existentes




BUG-001 [ESTADO: COMPLETADO ✅] BUG REPARADO 🟢

Fecha: 2025-11-23
Módulo: UI/Sidebar
Título: El menú lateral desaparece al hacer scroll en móvil.
Pasos para Reproducir:

Iniciar sesión en un dispositivo móvil.

Abrir la sidebar.

Hacer scroll hacia abajo en la página principal.
Esperado: La sidebar permanece visible/fija.
Actual: La sidebar se cierra automáticamente o se pierde.

Severidad: MENOR ☀️

BUG-002 [ESTADO: COMPLETADO ✅] BUG REPARADO 🟢

Fecha: 2025-11-23
Módulo: UI/Sidebar
Título: El menú lateral presenta fallos.
Pasos para Reproducir:

Iniciar sesión

Dar click en analiticas.

Esperado: El boton de cerrar sesión deberia funcionar aparte de la sidebar.
Actual: La sesion se cierra al dar click en analiticas, no sucede en cuentas, transacciones o resumenes solamente con analiticas.
Severidad: MAYOR☢️

BUG-003 [ESTADO: PENDIENTE 📅] BUG DISPONIBLE 🟢

Fecha: 2025-12-07
Módulo: Dashboard / Home
Título: Las transacciones de meses anteriores no se muestran en la sección "Últimos Movimientos" del Home.
Pasos para Reproducir:

Iniciar sesión en la aplicación

Navegar a Transacciones

Crear una nueva transacción con fecha del mes pasado (ejemplo: noviembre 2025)

Regresar al Home/Dashboard

Observar la sección "Últimos Movimientos"

Esperado: La transacción creada debería aparecer en la lista de "Últimos Movimientos" ya que es parte del historial general.
Actual: La transacción no aparece en "Últimos Movimientos" porque el código está filtrando solo las transacciones del mes actual. El filtro de mes/año se aplica tanto para calcular ingresos/gastos mensuales como para mostrar los últimos movimientos, cuando debería aplicarse solo para las estadísticas mensuales.
Ubicación del código: Home.jsx, líneas 58-76 (loadTransactions function)
Severidad: MAYOR☢️
Notas Técnicas: El problema está en que se usa el mismo array filtrado (sortedTransactions) tanto para calcular estadísticas mensuales como para mostrar los últimos movimientos. Se necesita separar la lógica: mantener todas las transacciones ordenadas para "Últimos Movimientos" y crear un filtro específico solo para el cálculo de ingresos/gastos mensuales.
