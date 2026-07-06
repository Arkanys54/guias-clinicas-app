# Manual de Usuario — Guias-clinicas

> Versión de la app: 1.0.0

Tabla de contenido
- Introducción
- Requisitos e instalación
- Primeros pasos (login y perfil)
- Navegación principal
- Módulo: Asistente Clínico
- Módulo: Búsqueda inteligente
- Módulo: Modo Decisión (VVC)
- Módulo: Algoritmos Clínicos
- Módulo: Casos Clínicos
- Ajustes y configuración (URL de la API, token, almacenamiento)
- Solución de problemas comunes
- Preguntas frecuentes (FAQ)
- Glosario
- Anexos: Atajos y buenas prácticas

---

Introducción

Este documento es un manual exhaustivo y paso a paso para usar la app "Guias-clinicas". Está escrito de forma extremadamente detallada y práctica, pensado para usuarios sin experiencia técnica. Cada sección incluye instrucciones claras, ejemplos y espacios donde insertar capturas de pantalla.

Nota sobre capturas: en cada sección verás un bloque marcado así:

\> [IMAGEN: colocar captura aquí] — Descripción de la captura

Sustituye por la imagen real en la ruta de tu proyecto, por ejemplo `assets/screenshots/mi-captura.png`. Usa Markdown para insertar la imagen: `![Descripción](./assets/screenshots/mi-captura.png)`.

---

Instalación en el dispositivo móvil

Esta sección explica cómo instalar la app en un teléfono Android o iOS. Está pensada para un usuario final (clínico) que recibe la app ya empaquetada, no para desarrolladores.

Opciones habituales de instalación:

- Desde una tienda oficial (Play Store / App Store):
  1. Abre Google Play (Android) o App Store (iOS) en tu teléfono.
  2. Busca la app por nombre: "Guias-clinicas".
  3. Pulsa "Instalar" (Play Store) o "Obtener" (App Store).
  4. Abre la app desde la pantalla de inicio o desde la propia tienda.

- Desde un enlace de distribución (instalación interna / Testing):
  1. Si tu institución usa TestFlight (iOS), Firebase App Distribution, o un enlace interno, abre el enlace que te haya enviado el responsable.
  2. Sigue las instrucciones de la plataforma (aceptar invitación, instalar test app).

- Instalación manual (APK en Android) — sólo si te lo indica el administrador:
  1. Pide el archivo APK al responsable.
  2. En Android, puede ser necesario permitir instalar aplicaciones desde "orígenes desconocidos" (Ajustes → Seguridad). Sigue las instrucciones seguras de tu institución.
  3. Toca el archivo APK en tu teléfono y confirma la instalación.

- Instalación rápida para pruebas (Expo Go) — sólo si el equipo de soporte te lo indica:
  1. Instala Expo Go desde Play Store / App Store.
  2. Abre el enlace o escanea el código QR que te envíen; la app se cargará dentro de Expo Go (modo desarrollo, no es una app final).

Permisos que puede solicitar la app

- Conexión a internet: la app necesita acceso a red para consultar guías y casos.
- Almacenamiento local: puede usar almacenamiento para guardar preferencias.
- Cámara/archivos: si alguna pantalla permite subir imágenes, la app pedirá permiso explícito.

Qué hacer si no puedes instalar la app

- Contacta al responsable de la distribución (soporte o administrador local) y solicita:
  - Enlace a la tienda o TestFlight.
  - Instrucciones o APK firmado (si procede).
- No instales APK de fuentes no confiables.

Captura:

> [IMAGEN: instalacion-movil.png] — Ejemplo de pantalla de instalación desde Play Store / TestFlight



Primeros pasos (login y perfil)

Objetivo: crear o iniciar sesión y configurar tu perfil.

1. Abrir la app y llegar a la pantalla principal.
   - Verás opciones: Asistente Clínico, Búsqueda inteligente, Modo Decisión, Algoritmos, Casos Clínicos.
   - Si no estás autenticado, la app mostrará la pantalla de login.

2. Login:
   - Escribe tu correo electrónico en el campo "Email".
   - Escribe tu contraseña en el campo "Contraseña".
   - Pulsa el botón "Iniciar sesión".
   - Si las credenciales son correctas, serás redirigido a la pantalla principal.

3. ¿Olvidaste tu contraseña?
   - Actualmente la app puede no incluir flujo de recuperación; contacta con el administrador si es necesario.

4. Perfil:
   - Accede al perfil desde la cabecera (si está habilitado) o desde el menú.
   - Aquí puedes cambiar tu contraseña y ver estadísticas personales.

> [IMAGEN: login.png] — Pantalla de login con campos resaltados

Navegación principal

La app usa pestañas y navegación por rutas. En la pantalla principal (Guías Clínicas) aparecen las acciones principales:

- Asistente Clínico: conversación asistida.
- Búsqueda inteligente: busca hallazgos y recomendaciones.
- Modo Decisión: flujo rápido (p. ej. VVC).
- Algoritmos Clínicos: catálogo y ejecución paso a paso.
- Casos Clínicos: práctica con casos interactivos.

Cómo moverse:
1. Toca la tarjeta del módulo que quieras abrir.
2. Usa la flecha o el botón "Volver" para regresar.
3. Algunas acciones dentro del Asistente abren rutas internas (algoritmos, búsqueda).

> [IMAGEN: pantalla-principal.png] — Menú principal con tarjetas

Módulo: Asistente Clínico

Propósito: interactuar con un asistente conversacional que devuelve respuestas basadas en guías, sugiere acciones (abrir algoritmos, buscar hallazgos) y permite ejecutar esas acciones dentro de la app.

Elementos clave:
- Composer (barra inferior): escribe mensaje.
- Quick prompts: sugerencias rápidas predefinidas.
- Mensajes: burbujas con texto, botones de acción.
- Provider badge: indica el estado del proveedor del asistente.

Uso detallado (paso a paso):

1. Abrir Asistente Clínico desde la pantalla principal.
2. Observa el encabezado: título "Asistente Clínico" y botón para volver.
3. Lee la tarjeta superior (hero) que explica límites del asistente: "Puede cometer errores. Verifica la información clínica." Esto significa que las respuestas son de ayuda, no sustituyen juicio clínico.
4. Componer una consulta:
   a. Toca el campo de texto (Composer) en la parte inferior.
   b. Escribe una pregunta simple y directa, por ejemplo: "Paciente con flujo vaginal y prurito: pasos para evaluación?"
   c. Pulsa enviar (botón enviar o tecla Enter en teclado virtual).

5. Interpretación de la respuesta:
   - El asistente puede devolver texto explicativo, una lista de acciones sugeridas o botones.
   - Si aparece un botón con acción (ej. "Abrir algoritmo sobre VVC"), pulsa para abrir el algoritmo correspondiente.

6. Acciones internas:
   - Botón "Abrir algoritmo" → llevará a la pantalla del algoritmo y mostrará el nodo actual.
   - Botón "Buscar" → abrirá la pantalla de búsqueda con términos prellenados.

Consejos para preguntas efectivas:
- Sé concreto: incluye datos como edad, signos claves y lo que quieres (diagnóstico, manejo, exámenes).
- Evita preguntas múltiples en una sola entrada. Haz preguntas separadas.

Capturas:

> [IMAGEN: asistente-composer.png] — Composer, quick prompts y ejemplo de mensaje
> [IMAGEN: asistente-respuesta-con-acciones.png] — Respuesta con botones de acción

Módulo: Búsqueda inteligente

Propósito: buscar hallazgos clínicos, obtener sugerencias en tiempo real y acceder a entradas de guías relacionadas.

Cómo usar:
1. Ir a Búsqueda (desde Guías o desde acciones del Asistente).
2. En el campo de búsqueda, empieza a escribir tu término (ej. "flujo vaginal").
3. A los 2 caracteres la app puede mostrar sugerencias en tiempo real.
4. Toca una sugerencia para ver el resultado completo.
5. El resultado muestra la definición del hallazgo, recomendaciones y enlaces a guías o algoritmos relacionados.

Búsqueda múltiple y autocompletar:
- Si necesitas varias coincidencias, usa la opción de "buscar múltiples" (si está disponible) y ajusta límite.

Capturas:

> [IMAGEN: busqueda-inicio.png] — Campo de búsqueda vacío
> [IMAGEN: busqueda-sugerencias.png] — Sugerencias en tiempo real
> [IMAGEN: busqueda-resultado.png] — Página de resultado con recomendaciones

Módulo: Modo Decisión (VVC)

Propósito: ejecutar un algoritmo rápido y guiado (ejemplo: Vaginitis por Cándida al Vulvovaginitis — VVC) para clasificar y proponer manejo en menos de 1 minuto.

Flujo paso a paso (usando el modo Decisión):
1. Abre "Modo Decisión" desde la pantalla principal.
2. Se mostrará una serie de pasos (triage, factores, diagnóstico, decisión, cultivo, resultado).
3. En cada paso, responde las opciones que correspondan al paciente actual:
   - P. ej. Paso Triage: elegir si hay prurito, flujo, signos sistémicos.
   - Paso Diagnóstico: seleccionar hallazgos de examen (pH, aspecto del flujo, test de KOH).
4. Avanza con el botón "Siguiente" o equivalente.
5. Al final verás la recomendación de manejo (tratamiento, observación, pruebas adicionales).
6. Si hay una opción de "abrir guías relacionadas", úsala para ver la fuente.

Consejos:
- Si no conoces un dato, el algoritmo permite marcar "desconocido" o elegir la opción que mejor se ajuste.
- Sigue el orden de pasos: cambiar respuestas en pasos previos puede alterar la recomendación final.

Capturas:

> [IMAGEN: modo-decision-paso1.png] — Paso Triage
> [IMAGEN: modo-decision-resultado.png] — Recomendación final

Módulo: Algoritmos Clínicos

Propósito: explorar algoritmos publicados, filtrarlos por categoría y ejecutarlos nodo a nodo.

Conceptos:
- Catálogo: lista de algoritmos disponibles.
- Runner (ejecución): interfaz para avanzar por nodos, ver contenido, evidencia y recomendaciones.
- Nodo: unidad del algoritmo (pregunta, decisión, acción, contenido).

Cómo usar:
1. Abre "Algoritmos" desde el menú.
2. Explora la lista: usa filtros por categoría si deseas limitar resultados.
3. Toca un algoritmo para ver su tarjeta con resumen.
4. Pulsa "Ejecutar" o "Abrir" para iniciar el runner.
5. En el runner, lee cada nodo y usa las opciones provistas (ej. seleccionar una rama de decisión).
6. Puedes volver a nodos previos si necesitas cambiar una elección.
7. Al terminar, revisa el estado de ejecución y notas.

Elementos de la pantalla runner:
- Header card: título y metadata del algoritmo.
- Content blocks: texto, imágenes, tablas, recomendaciones.
- Runtime state card: muestra variables y decisiones tomadas.
- Botones de acción: avanzar, retroceder, ver evidencia.

Capturas:

> [IMAGEN: catalogo-algoritmos.png] — Lista de algoritmos
> [IMAGEN: runner-nodo.png] — Nodo del algoritmo en ejecución

Módulo: Casos Clínicos

Propósito: practicar con casos clínicos interactivos, enviar respuestas y revisar estadísticas.

Cómo usar un caso clínico:
1. Abre "Casos Clínicos" desde el menú.
2. Selecciona una categoría (ej. ginecología) y luego un caso específico.
3. Lee el enunciado del caso paso a paso.
4. Selecciona la(s) opción(es) que creas correcta(s) para cada pregunta.
5. Pulsa "Enviar" cuando hayas completado el caso.
6. Resultado:
   - Si tu respuesta fue correcta, verás retroalimentación y la explicación.
   - Si fue incorrecta, verás la respuesta esperada y la explicación.
7. Reintentos:
   - Si la app marca el caso como "ya respondido", puede haber un tiempo de espera antes de permitir reintentar. La pantalla mostrará minutos restantes y un botón para reintentar cuando corresponda.

Estadísticas personales:
- En el perfil puedes ver estadísticas (puntuación, casos completados, tasa de aciertos).

Errores comunes y qué significan:
- Error 409 (ya respondido): significa que ya contestaste ese caso y debes esperar para reintentar.
- Error de conexión: la app no puede alcanzar el servidor (ver sección ajustes).

Capturas:

> [IMAGEN: casos-lista.png] — Categorías de casos
> [IMAGEN: caso-detalle.png] — Enunciado del caso y opciones
> [IMAGEN: caso-resultado.png] — Retroalimentación después de enviar

Ajustes y configuración

Dónde encontrar ajustes:
- Algunos ajustes están en el perfil o en la parte de configuración (si existe).

URL de la API (útil para desarrollo):
1. La app usa una URL base para la API que puede guardarse en AsyncStorage.
2. Para cambiarla desde la app (si existe la opción en UI): ve a Ajustes → API → introduce la URL completa (sin barra final).
3. Si no existe UI, puedes cambiar la constante `DEFAULT_API_URL` en `services/api.ts` o usar la función `setApiBaseUrl` si tienes una pantalla de configuración.

Token y sesión:
- El token JWT se guarda en memoria y las llamadas lo usan en el header `Authorization: Bearer <token>`.
- Cerrar sesión (si está implementado) debe borrar el token y redirigir al login.

Almacenamiento local:
- AsyncStorage guarda la URL de la API y posiblemente otros ajustes locales.

Capturas:

> [IMAGEN: ajustes-api.png] — Pantalla de ajustes con campo URL de API

Solución de problemas comunes

1. No puedo iniciar sesión:
   - Revisa conexión a internet.
   - Verifica que la URL de la API apunte a un servidor disponible.
   - Asegúrate de tener credenciales correctas.

2. La app no carga datos (errores de conexión):
   - Verifica la red y las reglas de firewall.
   - Para desarrollo con emulador Android, usa la IP de la máquina (ej. `10.0.2.2` o IP del host) y configura `DEFAULT_API_URL`.

3. Mensajes del asistente sin sentido:
   - El asistente puede cometer errores. Verifica la respuesta con la guía original o pregunta al asistente por la fuente.

4. Caso marcado como "ya respondido":
   - Espera el tiempo indicado para reintentar o revisa tu historial/estadísticas para confirmar la respuesta previa.

Preguntas frecuentes (FAQ)

Q: ¿Las recomendaciones son vinculantes?
A: No. Las recomendaciones apoyan la decisión clínica. Siempre validar con guías oficiales y juicio clínico.

Q: ¿Puedo usar la app sin conexión?
A: La app depende de la API para la mayoría de contenido. Algunas pantallas pueden tener caché mínimo, pero no es funcionalidad garantizada offline.

Q: ¿Cómo reporto un error o una guía obsoleta?
A: Contacta al responsable del proyecto o al soporte que aparezca en la documentación del deploy.

Glosario

- Algoritmo: conjunto de pasos clínicos para tomar decisiones.
- Nodo: unidad dentro de un algoritmo.
- VVC: Vulvovaginitis por Cándida (ejemplo usado en la app).
- AsyncStorage: almacenamiento local en la app.

Anexos: Atajos y buenas prácticas

- Antes de preguntar al asistente, resume el caso en 1-2 frases claras.
- Para búsqueda rápida, usa palabras clave en singular (ej. "vaginosis") y revisa sugerencias.
- En algoritmos, lee siempre la explicación de los nodos antes de aceptar la decisión.

---

Plantillas de capturas (ejemplos de rutas sugeridas)

- assets/screenshots/pantalla-principal.png
- assets/screenshots/login.png
- assets/screenshots/asistente-composer.png
- assets/screenshots/asistente-respuesta-con-acciones.png
- assets/screenshots/busqueda-sugerencias.png
- assets/screenshots/modo-decision-paso1.png
- assets/screenshots/runner-nodo.png
- assets/screenshots/caso-detalle.png

Inserta las imágenes en esas rutas y reemplaza los bloques de marcador mediante Markdown:

`![Pantalla principal](./assets/screenshots/pantalla-principal.png)`

---

Fin del manual.

