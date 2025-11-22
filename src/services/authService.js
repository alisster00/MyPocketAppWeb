const API_URL = 'http://localhost:3001'

export const authService = {

    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
            if (!response.ok) throw new Error('Error de conexión');

            const users = await response.json();
            if (users.length > 0) {
                return { success: true, user: users[0] };
            } else {
                return { success: false, message: 'Credenciales incorrectas' };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: 'Error del servidor' };
        }
    },

    register: async (userData) => {
        try {
            // A. Verificar si el email ya existe
            const checkRes = await fetch(`${API_URL}/users?email=${userData.email}`);
            const existingUsers = await checkRes.json();

            if (existingUsers.length > 0) {
                return { success: false, message: 'El correo ya está registrado' };
            }

            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) throw new Error('No se pudo registrar');

            const newUser = await response.json();
            return { success: true, user: newUser };

        } catch (error) {
            return { success: false, message: error.message || 'Error de red general. Intenta de nuevo.' };
        }
    }
};



