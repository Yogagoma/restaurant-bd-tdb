const platos = [
  { nombre: 'Arepa de Pabellón', descripcion: 'Arepa rellena de carne mechada, caraotas, plátano y queso', precio: 6.50, categoria: 'plato_principal' },
  { nombre: 'Tequeños', descripcion: 'Ración de 5 tequeños de queso con salsa de ajo', precio: 5.00, categoria: 'entrada' },
  { nombre: 'Cachapa con Queso de Mano', descripcion: 'Cachapa tradicional venezolana con doble queso de mano', precio: 8.00, categoria: 'plato_principal' },
  { nombre: 'Asado Negro', descripcion: 'Corte de carne en salsa oscura dulce, acompañado de arroz y puré', precio: 14.00, categoria: 'plato_principal' },
  { nombre: 'Empanada de Cazón', descripcion: 'Empanada frita rellena de cazón margariteño', precio: 3.50, categoria: 'entrada' },
  { nombre: 'Sopa de Res', descripcion: 'Sopa tradicional de costilla de res con verduras', precio: 9.00, categoria: 'entrada' },
  { nombre: 'Quesillo', descripcion: 'Postre tradicional venezolano a base de leche condensada y caramelo', precio: 4.50, categoria: 'postre' },
  { nombre: 'Tres Leches', descripcion: 'Bizcocho bañado en tres tipos de leche con merengue', precio: 5.00, categoria: 'postre' },
  { nombre: 'Papelón con Limón', descripcion: 'Bebida refrescante de caña de azúcar y limón', precio: 2.50, categoria: 'bebida' },
  { nombre: 'Chicha Venezolana', descripcion: 'Bebida dulce a base de arroz con leche condensada y canela', precio: 3.50, categoria: 'bebida' }
];

async function insertPlatos() {
  for (const plato of platos) {
    try {
      const response = await fetch('http://tradicionysabor.ddns.net:3000/api/v1/platos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'tk_live_8Xp3F2vL7mK9qR1cW4nY5zT6hJ0kE9mD'
        },
        body: JSON.stringify(plato)
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`✅ Insertado: ${plato.nombre}`);
      } else {
        console.error(`❌ Error en ${plato.nombre}:`, data);
      }
    } catch (err) {
      console.error(`❌ Error de red en ${plato.nombre}:`, err.message);
    }
  }
}

insertPlatos();
