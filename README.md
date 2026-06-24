# CRUD Node.js MySQL

Guía rápida para instalar y ejecutar el proyecto en local.

## Prerrequisitos

- Node.js 20 o superior
- MySQL instalado y en ejecución

## Clonar el repositorio

```bash
git clone https://github.com/ThuPapuha/CRUD-entrevista-trabajo.git
```

## Entrar al proyecto

```bash
cd CRUD-entrevista-trabajo
```

## Instalar dependencias

```bash
npm install
```

## Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con este formato:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=crud_service
```

## Importar base de datos

```bash
mysql -u root -p < database/schema.sql
```

Si el comando no funciona, se puede importar manualmente el archivo `database/schema.sql` desde un cliente MySQL.

## Ejecutar el servidor

```bash
npm run dev
```

Una vez iniciado, abre:

```text
http://localhost:3000/
```
