# Revisión del backend CASALIZ

## Arquitectura y rutas
- La API está versionada bajo el prefijo `/api/v1` y expone recursos para autenticación, proyectos, servicios, reseñas, usuarios y favoritos, separando rutas públicas y protegidas con middleware de Sanctum y políticas de autorización.【F:routes/api.php†L12-L82】
- Los listados de proyectos y servicios admiten filtros (tipo, ciudad/estado, búsqueda, categoría, destacado) y paginación configurable limitada a 100 ítems por página para evitar cargas excesivas.【F:app/Http/Controllers/Api/ProjectController.php†L14-L55】【F:app/Http/Controllers/Api/ServiceController.php†L14-L38】

## Autenticación y control de acceso
- Los endpoints de login y registro generan un token Sanctum; el login invalida tokens previos para mantener una sola sesión activa por usuario.【F:app/Http/Controllers/Api/AuthController.php†L13-L69】
- El acceso a detalles de proyectos y servicios verifica el estado publicado y permite excepciones para administradores (y autores en el caso de proyectos), devolviendo 404 cuando no hay permisos para minimizar fuga de información.【F:app/Http/Controllers/Api/ProjectController.php†L69-L85】【F:app/Http/Controllers/Api/ServiceController.php†L41-L52】
- Las rutas protegidas usan políticas para crear, actualizar y eliminar recursos, reforzando reglas por rol en el backend más allá del frontend.【F:routes/api.php†L34-L82】

## Modelos y persistencia
- Proyectos y servicios usan soft deletes y generan slugs basados en el título cuando no se proporciona uno manualmente, agregando un sufijo aleatorio para reducir colisiones iniciales.【F:app/Models/Project.php†L10-L45】【F:app/Models/Service.php†L10-L38】
- Las relaciones incluyen galerías ordenadas por posición, imágenes destacadas y asociaciones con autor, reseñas y favoritos, facilitando consultas ricas desde el API.【F:app/Models/Project.php†L47-L71】【F:app/Models/Service.php†L40-L53】
- Los endpoints de creación/edición manejan subida y orden de imágenes dentro de transacciones para mantener consistencia de datos.【F:app/Http/Controllers/Api/ProjectController.php†L87-L178】【F:app/Http/Controllers/Api/ServiceController.php†L54-L147】
- La creación y actualización de proyectos y servicios ahora utiliza generación incremental de slugs para mantener la unicidad sin exponer colisiones entre recursos.【F:app/Http/Controllers/Api/ProjectController.php†L87-L178】【F:app/Http/Controllers/Api/ServiceController.php†L54-L147】

## Oportunidades de mejora
- Considerar validaciones adicionales sobre el peso real de archivos al subir imágenes en servicios para homogeneizar los requisitos con el perfil de usuario, ya que actualmente se limitan la longitud del path y la cantidad de elementos.【F:app/Http/Controllers/Api/AuthController.php†L87-L125】【F:app/Http/Controllers/Api/ServiceController.php†L54-L147】
