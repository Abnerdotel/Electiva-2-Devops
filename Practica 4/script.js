
/**
 * Asegura que el script se ejecute despues de que todo el html se haya cargado y se haya analizado por completo. 
 * Eso evita errores que podrian ocurrir si el script intenta acceder a elementos del DOM que aun no se han cargado.
 */
document.addEventListener("DOMContentLoaded", function() {

    /**
     * Recupera una lista de estudiantes almacenada en localStorage.
     *  Si no existe, inicializa como un array vacio
     */
    var students = JSON.parse(localStorage.getItem("students")) || [];


    /**
     * Selecciona el tbody de la tabla con id studentTable donde 
     * se mostraran los estudiantes.
     */
    var studentTableBody = document.getElementById("studentTable").querySelector("tbody");

    /**
     * limpia el contenido actual del cuerpo de la tabla y
     *  agrega una fila (<tr>) por cada estudiante en el array students, 
     * incluyendo botones para editar y eliminar
     */
    function renderStudents() {
        studentTableBody.innerHTML = "";
        students.forEach((student, index) => {
            var row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.lastname}</td>
                <td>${student.tuition}</td>
                <td>${student.grade}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Editar</button>
                    <button class="delete-btn" data-index="${index}">Eliminar</button>
                </td>
            `;
            studentTableBody.appendChild(row);
        });
    }

    // Renderizar estudiantes al cargar la pagina y mostrar la lista de estos
    renderStudents();

    /**
     * Manejar agregar nuevo estudiante...
     * Este bloque configura el formulario y el modal para agregar un nuevo estudiante, reseteando el formulario y mostrando el modal.
     **/ 
    document.getElementById("addStudentBtn").addEventListener("click", function() {
        document.getElementById("studentForm").reset();
        document.getElementById("modalTitle").innerText = "Agregar Estudiante";
        document.getElementById("studentForm").removeAttribute("data-index");
        document.getElementById("studentModal").style.display = "block";
    });

    // cierra el modal cuando se hace clic en el elemento con la clase close.
    document.querySelector(".close").addEventListener("click", function() {
        document.getElementById("studentModal").style.display = "none";
    });


    /**
     * Manejar enviar formulario de estudiante...
     * maneja el envio del formulario, valida los datos, agrega o actualiza el estudiante en el array students,
     *  guarda los cambios en localStorage y vuelve a renderizar la lista de estudiantes.  
     **/

    document.getElementById("studentForm").addEventListener("submit", function(event) {
        event.preventDefault();

       
        var name = document.getElementById("name").value.trim();//Ayuda a evitar spacios en blanco al principio y al final
        var lastname  = document.getElementById("lastname").value.trim();
        var tuition = document.getElementById("tuition").value.trim();
        var grade = document.getElementById("grade").value.trim();
      
            
        if (!name || !lastname || !tuition || !grade) 
            return alert("No se permiten espacios en blanco"); 
        
        var student = {name: name, lastname: lastname, tuition: tuition, grade: grade };

        var index = document.getElementById("studentForm").getAttribute("data-index");

        if (index === null) {
            // Agregar nuevo estudiante
            students.push(student);
        } else {
            // Editar estudiante existente
            students[index] = student;
        }

        localStorage.setItem("students", JSON.stringify(students));
        renderStudents();
        document.getElementById("studentModal").style.display = "none";
    });


    // Manejar editar estudiante, luego de hacer click muestra los datos y modal para editar

    studentTableBody.addEventListener("click", function(event) {
        if (event.target.classList.contains("edit-btn")) {
            var index = event.target.getAttribute("data-index");
            var student = students[index];

            document.getElementById("name").value = student.name;
            document.getElementById("lastname").value = student.lastname;
            document.getElementById("tuition").value = student.tuition;
            document.getElementById("grade").value = student.grade;
            document.getElementById("studentForm").setAttribute("data-index", index);

            document.getElementById("modalTitle").innerText = "Editar Estudiante";
            document.getElementById("studentModal").style.display = "block";
        }
    });

    /**
     * Manejar eliminar estudiante...
     *  Elimina el estudiante del array students, actualiza localStorage y vuelve a renderizar la lista
     **/ 

    studentTableBody.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-btn")) {
            var index = event.target.getAttribute("data-index");
            students.splice(index, 1);
            localStorage.setItem("students", JSON.stringify(students));
            renderStudents();//Se invoca la funcion para el renderizado
        }
    });
});
