🔨 2. Mejoras de Funcionalidad (Existing Features)

Plantilla Rápida de Mejora (COPIAR Y PEGAR)

MEJORA-000 [ESTADO: PENDIENTE]

Fecha: [YYYY-MM-DD]
Módulo: [Ej: Configuración / Tareas / Reportes]
Funcionalidad: Nombre de la función a mejorar.
Problema Actual: ¿Qué ineficiencia o dolor resuelve?
Propuesta de Cambio: El cambio exacto que se sugiere (Ej: Añadir filtro X, cambiar color Y).

Reportes Existentes

MEJORA-001 [ESTADO: COMPLETADA ✅]

Fecha: 2025-11-20
Fecha Completado: 2025-12-07
Módulo: Gestión de Usuarios
Funcionalidad: Búsqueda en tabla de usuarios.
Problema Actual: La búsqueda solo funciona por nombre, no por email o ID.
Propuesta de Cambio: Extender el filtro de la tabla para que busque automáticamente en los campos 'nombre', 'email' e 'ID'.

MEJORA-002 [ESTADO: COMPLETADA ✅]

Fecha: 2025-12-05
Fecha Completado: 2025-12-05
Módulo: Dashboard / Transacciones
Funcionalidad: Actualización automática del balance al crear transacciones.
Problema Actual: Al crear una transacción, el balance total no se actualizaba automáticamente en la interfaz.
Propuesta de Cambio: Llamar a loadAccounts() después de crear una transacción para refrescar los datos.
Implementación: Se agregó la llamada a loadAccounts() en la función crearTransaction() tanto en Home.jsx como en TransactionsPage.jsx.

MEJORA-003 [ESTADO: COMPLETADA ✅]

Fecha: 2025-12-07
Fecha Completado: 2025-12-07
Módulo: Transacciones
Funcionalidad: Sistema de filtrado y búsqueda en historial de transacciones.
Problema Actual: No había forma de buscar o filtrar transacciones específicas en el historial completo.
Propuesta de Cambio: Implementar búsqueda por descripción y filtro por categoría.
Implementación:

- Agregado campo de búsqueda con icono de lupa
- Agregado selector de categorías dinámico
- Implementado useMemo para optimizar el filtrado
- Las categorías se generan automáticamente desde las transacciones existentes

MEJORA-004 [ESTADO: COMPLETADA ✅]

Fecha: 2025-12-07
Fecha Completado: 2025-12-07
Módulo: Transacciones
Funcionalidad: Validación de saldo insuficiente.
Problema Actual: Los usuarios podían crear gastos mayores al saldo disponible en cuentas normales.
Propuesta de Cambio: Validar el saldo antes de permitir crear un gasto, excepto en cuentas de crédito.
Implementación:

- Validación en crearTransaction() que verifica el balance disponible
- Mensaje de error con SweetAlert2 mostrando el saldo actual
- Excepción para cuentas de tipo "Crédito"

MEJORA-005 [ESTADO: COMPLETADA ✅]

Fecha: 2025-12-07
Fecha Completado: 2025-12-07
Módulo: Dashboard / Home
Funcionalidad: Cálculo de ingresos y gastos mensuales.
Problema Actual: No se mostraban estadísticas de ingresos y gastos del mes actual.
Propuesta de Cambio: Calcular y mostrar ingresos y gastos del mes en curso.
Implementación:

- Filtrado de transacciones por mes y año actual
- Cálculo separado de ingresos y gastos
- Visualización en cards con iconos distintivos (TrendingUp/TrendingDown)

MEJORA-006 [ESTADO: COMPLETADA ✅]

Fecha: 2025-12-07
Fecha Completado: 2025-12-07
Módulo: Transacciones
Funcionalidad: Categorías dinámicas según tipo de transacción.
Problema Actual: Las categorías no cambiaban según el tipo de transacción seleccionado.
Propuesta de Cambio: Mostrar categorías específicas para gastos e ingresos.
Implementación:

- Categorías de Gastos: Casa, Transporte, Alimentación, Capricho, Otros
- Categorías de Ingresos: Salario, Pagos Varios, Préstamos
- Reseteo automático de categoría al cambiar tipo de transacción

MEJORA-007 [ESTADO: COMPLETADA ✅]

Fecha: 2025-12-07
Fecha Completado: 2025-12-07
Módulo: Transacciones / Home
Funcionalidad: Ordenamiento de transacciones por fecha.
Problema Actual: Las transacciones no se mostraban en orden cronológico.
Propuesta de Cambio: Ordenar transacciones de más reciente a más antigua.
Implementación: Uso de sort() con comparación de fechas en loadTransactions().
