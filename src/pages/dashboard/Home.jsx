import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ArrowRightLeft, Wallet, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../api/servicios';
import { formatearMoneda } from '../../utils/FormateoValores';
import Swal from 'sweetalert2';

export const DashboardHome = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden border-indigo-100">
          <div className="absolute right-0 top-0 p-4 opacity-5 text-indigo-600">
            <DollarSign size={100} />
          </div>
          <p className="text-slate-500 text-sm font-medium">Balance Total</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">
            {loading ? (
              <span className="animate-pulse">Cargando...</span>
            ) : (
              formatearMoneda(totalBalance)
            )}
          </h3>
          <div className="flex items-center gap-2 mt-4">
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
              <TrendingUp size={12} /> +12%
            </span>
            <span className="text-slate-400 text-xs">vs mes anterior</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <span className="text-slate-400 text-xs">Este mes</span>
          </div>
          <p className="text-slate-500 text-sm">Ingresos</p>
          <h3 className="text-2xl font-bold text-slate-800">
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : (
              formatearMoneda(monthlyIncome)
            )}
          </h3>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
              <TrendingDown size={20} />
            </div>
            <span className="text-slate-400 text-xs">Este mes</span>
          </div>
          <p className="text-slate-500 text-sm">Gastos</p>
          <h3 className="text-2xl font-bold text-slate-800">
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : (
              formatearMoneda(monthlyExpenses)
            )}
          </h3>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-80 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-slate-800">Análisis de Gastos</h4>
              <select className="bg-slate-50 border-none text-sm text-slate-500 rounded-lg p-2 outline-none">
                <option>Este año</option>
                <option>Este mes</option>
                <option>Este dia</option>
              </select>
            </div>
            <div className="flex-1 flex items-end gap-4 px-4 pb-4 border-b border-slate-100">
              {[40, 70, 45, 90, 65, 80, 55, 85].map((h, i) => (
                <div key={i} className="w-full bg-indigo-50 rounded-t-xl relative group hover:bg-indigo-100 transition-all cursor-pointer">
                  <div
                    style={{ height: `${h}%` }}
                    className="absolute bottom-0 w-full bg-indigo-500 rounded-t-xl opacity-80 group-hover:opacity-100 transition-all shadow-lg shadow-indigo-500/20"
                  ></div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 text-white !border-none">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-slate-400 text-sm">Disponible en Cuentas</p>
                <h3 className="text-3xl font-bold mt-1 text-green-500">
                  {loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    formatearMoneda(totalBalance)
                  )}
                </h3>
              </div>
              <div className="p-2 bg-white/10 rounded-lg">
                <Wallet size={20} />
              </div>
            </div>
            <Button onClick={() => setShowModal(true)} className="w-full">
              <Plus size={16} />
              Nueva Transacción
            </Button>
          </Card>

          <div>
            <h3 className="font-bold text-slate-800 mb-4">Últimos Movimientos</h3>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <Card key={transaction.id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${transaction.type === 'expense' ? 'bg-rose-50 text-rose-600' :
                      transaction.type === 'income' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                      {transaction.type === 'expense' ? <TrendingDown size={16} /> :
                        transaction.type === 'income' ? <TrendingUp size={16} /> :
                          <ArrowRightLeft size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{transaction.title}</p>
                      <p className="text-xs text-slate-400">{transaction.category}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${transaction.type === 'expense' ? 'text-rose-600' :
                    transaction.type === 'income' ? 'text-emerald-600' :
                      'text-slate-600'
                    }`}>
                    {transaction.type === 'expense' ? '-' : '+'}${Math.abs(transaction.amount).toLocaleString()}
                  </span>
                </Card>
              ))}
            </div>
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
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all"
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