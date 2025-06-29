<h1 align="center">Backend con FastAPI</h1>

<p align="center">
  <strong>API desarrollada con FastAPI, Python 3.11, PostgreSQL y Chroma</strong>
</p>

<div align="center">
  <img src="https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png" alt="FastAPI" width="200">
</div>

<h2>📋 Requisitos previos</h2>

<ul>
  <li>Python 3.11 instalado</li>
  <li>Pipenv instalado (<code>pip install pipenv</code>)</li>
  <li>PostgreSQL instalado y corriendo</li>
  <li>Credenciales de Gemini API</li>
</ul>

<h2>🚀 Instalación</h2>

<ol>
  <li>
    <h3>Clonar el repositorio</h3>
    <pre><code>git clone https://github.com/Csierra036/Diogen-chatbot.git
cd backend</code></pre>
  </li>
  
  <li>
    <h3>Configurar entorno virtual e instalar dependencias</h3>
    <pre><code>pipenv install</code></pre>
  </li>
  
  <li>
    <h3>Configurar variables de entorno</h3>
    <p>Crea un archivo <code>.env</code> basado en <code>.env.example</code>:</p>
  </li>
</ol>

<h2>⚡ Ejecución</h2>

<p>Para iniciar el servidor:</p>
<pre><code>pipenv run start</code></pre>

<p>El servidor estará disponible en <a href="http://localhost:8000">http://localhost:8000</a></p>

<h3>Documentación API</h3>
<ul>
  <li><a href="http://localhost:8000/docs">Swagger UI</a></li>
</ul>

<h2>🔧 Comandos útiles</h2>

<table>
  <tr>
    <th>Comando</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <td><code>pipenv shell</code></td>
    <td>Activar entorno virtual</td>
  </tr>
  <tr>
    <td><code>pipenv run start</code></td>
    <td>Ejecutar backend</td>
  </tr>
  <tr>
    <td><code>pipenv install</code></td>
    <td>Instalar pipfile</td>
  </tr>
</table>




<h1 align="center">Frontend con React</h1>

<p align="center">
  <strong>Aplicación moderna construida con React y Vite</strong>
</p>

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" width="120">
  <img src="https://vitejs.dev/logo.svg" alt="Vite" width="120">
</div>

<h2>✨ Características</h2>

<h3>Requisitos</h3>
<ul>
  <li>Node.js v16+</li>
  <li>npm v8+ o yarn</li>
</ul>

<h3>Instalación</h3>

<ol>
  <li>
    <h3>Clonar el repositorio</h3>
    <pre><code>git clone https://github.com/Csierra036/Diogen-chatbot.git
cd frontend</code></pre>
  </li>
  
  <li>
    <strong>Instalar dependencias</strong>
    <pre><code>npm install</code></pre>
    o
    <pre><code>yarn install</code></pre>
  </li>
</ol>

<h2>🛠 Desarrollo</h2>

<h3>Ejecutar servidor de desarrollo</h3>
<pre><code>npm run dev</code></pre>
o
<pre><code>yarn dev</code></pre>

<p>La aplicación estará disponible en <a href="http://localhost:5173">http://localhost:5173</a></p>


<h2>🔧 Comandos útiles</h2>

<table>
  <tr>
    <th>Comando</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <td><code>npm run dev</code></td>
    <td>Inicia servidor de desarrollo</td>
  </tr>
  <tr>
    <td><code>npm run build</code></td>
    <td>Crea versión para producción</td>
  </tr>
  <tr>
    <td><code>npm run preview</code></td>
    <td>Previsualiza build de producción</td>
  </tr>
  <tr>
    <td><code>npm run lint</code></td>
    <td>Ejecuta linter</td>
  </tr>
</table>
