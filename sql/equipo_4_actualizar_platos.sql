-- Modificación de la tabla platos para agregar los campos esperados por el frontend
ALTER TABLE plato
ADD COLUMN IF NOT EXISTS imagen_url TEXT,
ADD COLUMN IF NOT EXISTS disponible BOOLEAN DEFAULT TRUE;
