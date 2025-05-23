document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const mensaje = document.getElementById('mensajeResultado'); // Corregido
    const fotoInput = document.getElementById('fotografia');
    const fotoPreview = document.getElementById('fotoPreview');

    // Vista previa de la fotografía
    fotoInput.addEventListener('change', () => {
        const file = fotoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                fotoPreview.src = e.target.result;
                fotoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Validar y enviar formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar campos requeridos
        const formData = new FormData(form);
        const camposObligatorios = ['identificacion', 'nombres', 'fechaNacimiento', 'genero', 'telefono', 'correo'];
        let camposVacios = camposObligatorios.filter(campo => !formData.get(campo));

        if (camposVacios.length > 0) {
            mensaje.innerHTML = '<div class="mensaje-error">⚠️ Faltan campos por llenar.</div>';
            return;
        }

        try {
            const response = await fetch('/registrar', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                mensaje.innerHTML = `<div class="mensaje-exito">✅ ${data.mensaje}</div>`;
                form.reset();
                fotoPreview.style.display = 'none';
            } else {
                mensaje.innerHTML = `<div class="mensaje-error">❌ ${data.mensaje}</div>`;
            }
        } catch (error) {
            mensaje.innerHTML = '<div class="mensaje-error">❌ Error en el envío del formulario.</div>';
            console.error('Error:', error);
        }
    });
});
