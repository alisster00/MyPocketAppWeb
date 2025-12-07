import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ArrowRightLeft, Wallet, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../api/servicios';
import { formatearMoneda } from '../../utils/FormateoValores';
import Swal from 'sweetalert2';

export const TransactionsPage = () => {
   const [accounts, setAccounts] = useState([]);
     const [totalBalance, setTotalBalance] = useState(0);
     const [loading, setLoading] = useState(true);
     const [transactions, setTransactions] = useState([]);
     const [monthlyIncome, setMonthlyIncome] = useState(0);
     const [monthlyExpenses, setMonthlyExpenses] = useState(0);
     const [showModal, setShowModal] = useState(false);
     const [newTransaction, setNewTransaction] = useState({
       title: '',
       category: '',
       amount: 0,
       type: 'expense',
       date: new Date(),
       accountId: '',
     });
   
     useEffect(() => {
       loadAccounts();
       loadTransactions();
     }, []);
   
     const loadAccounts = async () => {
       try {
         setLoading(true);
         const data = await api.getAllAccounts();
         setAccounts(data);
   
         const total = data.reduce((sum, account) => sum + account.balance, 0);
         setTotalBalance(total);
       } catch (error) {
         console.error('Error al cargar cuentas:', error);
       } finally {
         setLoading(false);
       }
     };
   
     const loadTransactions = async () => {
       try {
         setLoading(true);
         const data = await api.getAllTransactions();
   
         const sortedTransactions = data.sort((a, b) => {
           return new Date(b.date) - new Date(a.date);
         });
   
         setTransactions(sortedTransactions);
   
     
         const currentMonth = new Date().getMonth();
         const currentYear = new Date().getFullYear();
   
         let income = 0;
         let expenses = 0;
   
         sortedTransactions.forEach(transaction => {
           const transactionDate = new Date(transaction.date);
           if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
             if (transaction.type === 'income') {
               income += parseFloat(transaction.amount);
             } else if (transaction.type === 'expense') {
               expenses += parseFloat(transaction.amount);
             }
           }
         });
   
         setMonthlyIncome(income);
         setMonthlyExpenses(expenses);
   
       } catch (error) {
         console.error('Error al cargar transacciones:', error);
       } finally {
         setLoading(false);
       }
     };
   
     const crearTransaction = async (e) => {
       e.preventDefault();
   
   
       if (!newTransaction.accountId) {
         Swal.fire({
           icon: 'warning',
           title: 'Cuenta requerida',
           text: 'Por favor selecciona una cuenta para la transacción',
         });
         return;
       }
   
       if (!newTransaction.title || !newTransaction.category || !newTransaction.amount) {
         Swal.fire({
           icon: 'warning',
           title: 'Datos incompletos',
           text: 'Por favor completa todos los campos',
         });
         return;
       }
   
       if (newTransaction.amount <= 0) {
         Swal.fire({
           icon: 'warning',
           title: 'Monto inválido',
           text: 'El monto debe ser mayor a cero',
         });
         return;
       }
   
       const account = accounts.find(acc => acc.id === newTransaction.accountId);
   
       if (!account) {
         Swal.fire({
           icon: 'error',
           title: 'Error',
           text: 'No se encontró la cuenta seleccionada',
         });
         return;
       }
   
       if (newTransaction.type === 'expense' && account.type !== 'Crédito') {
         const newBalance = account.balance - parseFloat(newTransaction.amount);
         if (newBalance < 0) {
           Swal.fire({
             icon: 'warning',
             title: 'Saldo insuficiente',
             text: `No tienes suficiente saldo en ${account.name}. Saldo actual: ${formatearMoneda(account.balance)}`,
           });
           return;
         }
       }
   
       try {
         const transactionData = {
           ...newTransaction,
           amount: parseFloat(newTransaction.amount),
           date: newTransaction.date.toISOString(),
         };
   
         await api.createTransaction(transactionData);
   
         const newBalance = newTransaction.type === 'income'
           ? account.balance + parseFloat(newTransaction.amount)
           : account.balance - parseFloat(newTransaction.amount);
   
         await api.updateAccount(account.id, {
           ...account,
           balance: newBalance
         });
   
         Swal.fire({
           icon: 'success',
           title: 'Transacción creada',
           text: 'La transacción se ha creado y el balance se actualizó correctamente',
         });
   
         loadTransactions();
         loadAccounts();
         setShowModal(false);
         setNewTransaction({
           title: '',
           category: '',
           amount: 0,
           type: 'expense',
           date: new Date(),
           accountId: '',
         });
   
       } catch (error) {
         console.error('Error al crear transacción:', error);
         Swal.fire({
           icon: 'error',
           title: 'Error',
           text: 'No se pudo crear la transacción',
         });
       } finally {
         setLoading(false);
       }
     };
   
     const handleInputChange = (e) => {
       const { name, value } = e.target;
       setNewTransaction((prev) => ({
         ...prev,
         [name]: value,
       }));
     };
     

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold">Transacciones</h1>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva transacción
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* 2. Sección Izquierda: Ingresos */}
                <div>
                    <h2 className="text-xl font-bold mb-4 text-green-600">💰 Ingresos</h2>
                 
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {transactions.filter((transaction) => transaction.type === 'income').map((transaction) => (
                            <Card key={transaction.id} className="p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">{transaction.title}</h2>
                                    <span className="text-sm">
                                        
                                        <TrendingUp className="text-green-500 h-4 w-4" />
                                    </span>
                                </div>
                                <p className="text-sm">Categoría: {transaction.category}</p>
                                <p className="text-sm">Monto: {formatearMoneda(transaction.amount)}</p>
                                <p className="text-sm">Fecha: {new Date(transaction.date).toLocaleDateString()}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 3. Sección Derecha: Gastos */}
                <div>
                    <h2 className="text-xl font-bold mb-4 text-red-600">💸 Gastos</h2>
                    {/* Sub-cuadrícula: Muestra las tarjetas de gasto en 2 o 3 columnas */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {transactions.filter((transaction) => transaction.type === 'expense').map((transaction) => (
                            <Card key={transaction.id} className="p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">{transaction.title}</h2>
                                    <span className="text-sm">
                                        {/* Lógica de icono simplificada */}
                                        <TrendingDown className="text-red-500 h-4 w-4" />
                                    </span>
                                </div>
                                <p className="text-sm">Categoría: {transaction.category}</p>
                                <p className="text-sm">Monto: {formatearMoneda(transaction.amount)}</p>
                                <p className="text-sm">Fecha: {new Date(transaction.date).toLocaleDateString()}</p>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>
             {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Nueva Transacción</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={crearTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tipo de Transacción
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'expense', category: '' })}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${newTransaction.type === 'expense'
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    💸 Gasto
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'income', category: '' })}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${newTransaction.type === 'income'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    💰 Ingreso
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Cuenta
                </label>
                <select
                  name="accountId"
                  value={newTransaction.accountId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  required
                >
                  <option value="">Selecciona una cuenta</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.type}) - {formatearMoneda(account.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Categoría
                </label>
                <select
                  name="category"
                  value={newTransaction.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {newTransaction.type === 'expense' ? (
                    <>
                      <option value="Casa">🏠 Casa</option>
                      <option value="Transporte">🚗 Transporte</option>
                      <option value="Alimentación">🍔 Alimentación</option>
                      <option value="Capricho">🎁 Capricho</option>
                      <option value="Otros">📦 Otros</option>
                    </>
                  ) : (
                    <>
                      <option value="Salario">💼 Salario</option>
                      <option value="Pagos Varios">💳 Pagos Varios</option>
                      <option value="Préstamos">🏦 Préstamos</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  name="title"
                  value={newTransaction.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  placeholder="Ej: Compra del supermercado"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Monto
                </label>
                <input
                  type="number"
                  name="amount"
                  value={newTransaction.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  value={newTransaction.date instanceof Date ? newTransaction.date.toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: new Date(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all cursor-pointer hover:text-slate-600"
                >
                  Cancelar
                </button>
                <Button type="submit" className="flex-1">
                  Crear Transacción
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
    );
};
