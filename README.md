# Node MySQL CRUD Service

Microservicio CRUD en Node.js con Express y MySQL. Recibe y responde JSON para gestionar registros con nombre completo, RFC, correo electrónico y código postal.

## Requisitos

- Node.js 20 o superior
- MySQL 8 o compatible
- Postman para probar los endpoints

## Instalación

```bash
npm install
```

Copia el archivo de variables de entorno:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Edita `.env` con tus credenciales de MySQL.

## Base de datos

Ejecuta el script:

```bash
mysql -u root -p < database/schema.sql
```

También puedes abrir `database/schema.sql` en MySQL Workbench y ejecutarlo.

## Ejecutar

```bash
npm run dev
```

O en modo producción local:

```bash
npm start
```

El servicio queda disponible en:

```text
http://localhost:3000
```

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/health` | Verifica que el servicio está activo |
| POST | `/api/records` | Crea un registro |
| GET | `/api/records` | Lista registros |
| GET | `/api/records/:id` | Obtiene un registro por id |
| PUT | `/api/records/:id` | Actualiza un registro |
| DELETE | `/api/records/:id` | Elimina un registro |

## Ejemplo JSON

```json
{
  "fullName": "Juan Perez Lopez",
  "rfc": "PELJ800101ABC",
  "email": "juan.perez@example.com",
  "postalCode": "01000"
}
```

## Validaciones

- `fullName`: requerido, entre 3 y 120 caracteres
- `rfc`: requerido, formato RFC válido de persona física o moral
- `email`: requerido, formato de correo válido
- `postalCode`: requerido, 5 dígitos

## Postman

Importa la colección:

```text
postman/node-mysql-crud.postman_collection.json
```

La variable `baseUrl` apunta por defecto a:

```text
http://localhost:3000
```

## Scripts

```bash
npm start
npm run dev
npm run lint
npm test
```

## GitHub Actions

El workflow `.github/workflows/ci.yml` instala dependencias, ejecuta ESLint y corre las pruebas en cada push o pull request hacia `main`.

## Despliegue en AWS

Ruta recomendada:

- Elastic Beanstalk para el microservicio Node.js
- Amazon RDS for MySQL para la base de datos

Variables requeridas en Elastic Beanstalk:

```text
DB_HOST=endpoint-rds.amazonaws.com
DB_PORT=3306
DB_USER=usuario_rds
DB_PASSWORD=password_rds
DB_NAME=crud_service
```

También es compatible con las variables `RDS_HOSTNAME`, `RDS_PORT`, `RDS_USERNAME`, `RDS_PASSWORD` y `RDS_DB_NAME` generadas por Elastic Beanstalk cuando se adjunta una base RDS al ambiente.

Después de configurar la base de datos remota, ejecuta la migración:

```bash
npm run migrate
```

En Elastic Beanstalk la migración también se ejecuta automáticamente después de cada despliegue si existen variables de conexión a base de datos.

## Publicar en GitHub

Después de crear un repositorio vacío en GitHub, enlázalo y sube el código:

```bash
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git add .
git commit -m "Initial CRUD microservice"
git push -u origin main
```
