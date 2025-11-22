import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from "./Button";
import { X } from 'lucide-react';



export const Modal = ({ isOpen, onClose, title, message, type}) => {
    if (!isOpen) return null;
    
    const colors = { 
       success: { 
            bg: 'bg-green-100 border-green-300', 
            text: 'text-green-800', 
            icon: CheckCircle 
        },
        error: { 
            bg: 'bg-rose-100 border-rose-300', 
            text: 'text-rose-800', 
            icon: AlertCircle 
        }
    };
         

    const { bg, text, icon: Icon } = colors[type] || colors.error;

     return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border ${bg} transition-all duration-300 transform scale-100`}>
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                        <Icon size={24} className={text} />
                        <h3 className={`text-xl font-bold ${text}`}>{title}</h3>
                    </div>
                    <Button 
                        variant="ghost" 
                        onClick={onClose} 
                        className={`p-1 ${text} hover:bg-transparent`}
                    >
                        <X size={20}
                        onClick={onClose}/>
                    </Button>
                </div>

                <p className={`mt-4 text-sm ${text}`}>{message}</p>

                <div className="mt-6 flex justify-end">
                    {/* El botón de acción está siempre presente para cerrar */}
                    <Button variant="primary" onClick={onClose} >
                        {type === 'success' ? 'Continuar' : 'Aceptar'}
                    </Button>
                </div>
            </div>
        </div>
    );
};


