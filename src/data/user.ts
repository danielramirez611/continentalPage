// src/data/users.ts
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Administrador',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Usuario Regular',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  }
];

export const mockLoginAPI = (credentials: { email: string; password: string }): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );
      
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Credenciales inválidas'));
      }
    }, 1000);
  });
};