import  {pool } from '../db.js';



/* ***************************** Obtener todos los usuarios *******************************/

export const getUsers =  async (req, res) => {
  try {
      //  Obtener todos los usuarios de la base de datos
      const { rows } = await pool.query('SELECT * FROM users ORDER BY id ASC');

      //  Responder con la lista de usuarios
      res.json({
          message: 'Users retrieved successfully',
          total: rows.length,
          users: rows
      });

  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
}




/* ***************************** Get user by ID *******************************/

export const getUser =  async (req, res) => {
  const { userId } = req.params;

  //  Validar que el ID sea un número válido
  if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
      //  Buscar el usuario en la base de datos
      const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

      //  Si no se encontró el usuario, devolver error 404
      if (rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Respuesta con el usuario encontrado
      res.json({ user: rows[0] });

  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};



/* ***************************** Create a new user *******************************/

export const createUser =  async (req, res) => {
  const { name, email } = req.body;

  // Validación de datos antes de ejecutar la consulta
  if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
      //Insertar usuario en la base de datos con RETURNING *
      const { rows } = await pool.query(
          'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
          [name, email]
      );

      // Verificar si la inserción fue exitosa
      if (rows.length === 0) {
          return res.status(500).json({ message: 'User could not be created' });
      }

      // Devolver solo el usuario creado
      res.status(201).json({ message: 'User created successfully', user: rows[0] });
  } catch (error) {
      console.error('Database error:', error);

      if (error?.code === '23505') {
          // Error de duplicado (unique constraint violation)
          return res.status(409).json({ message: 'Email already exists' });
      }
      // Otros errores de base de datos
      res.status(500).json({ message: 'Internal Server Error' });
  }
};




/* ***************************** update User *******************************/


export const updateUser =  async (req, res) => {
  // Obtener los parámetros y el cuerpo de la solicitud
  
    const { userId } = req.params;
    const { name, email } = req.body;
   
    // Validar que los datos sean correctos antes de ejecutar la consulta
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
  
    try {
        // Ejecutar la actualización en la base de datos
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, userId]
        );
  
        // Verificar si el usuario realmente fue actualizado
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `User with ID: ${userId} not found` });
        }
  
        // Responder con el usuario actualizado
        res.json({
            message: `User with ID: ${userId} updated successfully`,
            user: result.rows[0], // Devuelve el usuario actualizado
        });
  
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };
  



  /* ***************************** Delete user by ID *******************************/

export const deleteUser =  async (req, res) => { 

  const { userId } = req.params;

  //Validar que el ID sea un número válido
  if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID tiene que un número válido' });
  }

  try {
      // Intentar eliminar el usuario
      const { rowCount, rows } = await pool.query(
          'DELETE FROM users WHERE id = $1 RETURNING *',
          [userId]
      );

      // Si no se encontró el usuario, devolver un error 404
      if (rowCount === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Respuesta clara con el usuario eliminado
      res.json({
          message: 'User deleted successfully',
          deletedUser: rows[0] // Muestra el usuario eliminado
      });
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};
