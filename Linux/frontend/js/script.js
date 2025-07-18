// Espera a que el DOM esté completamente cargado para iniciar el renderizado
document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3001/api/items/MLA001')  // Llama al backend para obtener datos del producto
    .then(response => response.json())
    .then(data => renderProduct(data))             // Renderiza toda la UI con los datos del producto
    .catch(error => console.error('Error al cargar el producto:', error));
});

/**
 * Renderiza toda la información del producto en la interfaz
 */
function renderProduct(product) {
  // Imagen principal
  const mainImage = document.getElementById('main-image');
  mainImage.src = product.pictures[0];
  mainImage.alt = product.title;

  // Elementos necesarios para la lupa (zoom)
  const zoomLens = document.getElementById('zoomLens');
  const zoomResult = document.getElementById('zoomResult');

  // Miniaturas (thumbnails)
  const thumbnails = document.getElementById('thumbnail-list');
  thumbnails.innerHTML = '';
  product.pictures.forEach(pic => {
    const thumb = document.createElement('img');
    thumb.src = pic;
    thumb.style.cursor = 'pointer';
    thumb.onclick = () => {
      mainImage.src = pic;
      zoomResult.style.backgroundImage = `url('${pic}')`;
      mainImage.onload = () => addZoom(mainImage, zoomResult, zoomLens);
    };
    thumbnails.appendChild(thumb);
  });

  // Título del producto con insignia "Más vendido"
  const titleContainer = document.getElementById('product-title');
  titleContainer.innerHTML = product.is_best_seller
    ? `<span class="badge-best">MÁS VENDIDO</span><br>${product.title}`
    : product.title;

  // Estrellas promedio según las opiniones
  const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
  const fullStars = Math.floor(avgRating);
  const halfStar = avgRating % 1 >= 0.5;
  let starsHTML = '★'.repeat(fullStars);
  if (halfStar) starsHTML += '☆';
  starsHTML = starsHTML.padEnd(5, '☆');
  document.getElementById('product-rating').innerHTML = `
    <div style="color: #007BFF; font-size: 14px; margin: 4px 0;">
      ${starsHTML} ${avgRating.toFixed(1)} (${product.reviews.length} opiniones)
    </div>
  `;

  // Precio formateado con simulación de "precio anterior" y cuotas
  const originalPrice = product.price * 1.2;
  const formattedOriginalPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: product.currency
  }).format(originalPrice);
  const formattedFinalPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: product.currency
  }).format(product.price);
  const cuotasText = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: product.currency
  }).format(product.price / 10);

  document.getElementById('product-price').innerHTML = `
    <div class="price-old">${formattedOriginalPrice}</div>
    <div class="price-current">${formattedFinalPrice}</div>
    <div class="cuotas">en 10x ${cuotasText} sin interés</div>
  `;

  // Cantidad de stock
  document.getElementById("product-stock").innerHTML = `
    <div class="stock-badge">📦 Stock disponible: <strong>${product.available_quantity}</strong></div>
  `;

  // Descripción del producto
  document.getElementById('product-description').textContent = product.description;

  // Información del vendedor
  document.getElementById('seller-name').innerHTML = `
    <div class="seller-box d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-3">
        <img class="seller-logo" src="${product.seller.logo}" alt="${product.seller.name}" />
        <div class="seller-info">
          <span><strong>${product.seller.name}</strong></span>
          <span class="seller-status">${product.seller.status}</span>
          <span class="seller-rating">⭐ ${product.seller.rating}</span>
        </div>
      </div>
      <a href="${product.seller.link}" target="_blank" class="seller-link">Ver tienda</a>
    </div>
  `;

  // Información de envío
  document.getElementById("envio-gratis").innerHTML = `
    <img src="assets/icons/mercadoenvios.svg" alt="Mercado Envíos" width="32" height="32" />
    <span class="text-success fw-bold">${product.shipping_info}</span>
  `;

  // Métodos de pago
  const paymentDiv = document.getElementById('payment-methods');
  paymentDiv.innerHTML = '';
  product.payment_methods.forEach(method => {
    const img = document.createElement('img');
    img.alt = method;
    img.title = method;
    img.style.height = '28px';
    img.style.objectFit = 'contain';
    img.style.marginRight = '8px';
    img.src = method === 'Visa'
      ? 'https://logodownload.org/wp-content/uploads/2016/10/visa-logo-1.png'
      : method === 'MasterCard'
      ? 'https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo-3.png'
      : method === 'MercadoPago'
      ? 'assets/icons/mercadopago-logo.svg'
      : 'https://via.placeholder.com/42?text=?';
    paymentDiv.appendChild(img);
  });

  // Lista de opiniones
  const reviewList = document.getElementById('review-list');
  reviewList.innerHTML = '';
  product.reviews.forEach(review => {
    const li = document.createElement('li');
    li.className = 'list-group-item review-box';
    li.innerHTML = `
      <div><strong>${review.user}:</strong> ${review.comment}</div>
      <div class="star" style="color:#007BFF;">${'★'.repeat(review.rating)}</div>
    `;
    reviewList.appendChild(li);
  });

  // Características técnicas
  const featuresBox = document.getElementById('product-features');
  featuresBox.innerHTML = '';
  product.features.forEach((feature) => {
    const col = document.createElement('div');
    col.className = 'col-md-3';
    col.innerHTML = `
      <img src="assets/icons/${feature.icon}.svg" alt="${feature.label}" class="feature-icon" />
      <p>${feature.label}</p>
    `;
    featuresBox.appendChild(col);
  });

  // Preguntas y respuestas
  renderQuestions(product);

  // Efecto lupa
  addZoom(mainImage, zoomResult, zoomLens);

  // Envío de nueva pregunta
  const questionForm = document.getElementById('qa-form');
  if (questionForm) {
    questionForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const user = document.getElementById('qa-user').value.trim();
      const question = document.getElementById('qa-question').value.trim();
      if (!user || !question) {
        alert('Por favor completá todos los campos.');
        return;
      }

      const newQuestion = {
        user,
        question,
        date: new Date().toISOString(),
        answer: null,
        answerDate: null
      };

      fetch(`http://localhost:3001/api/items/${product.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion)
      })
        .then(res => res.json())
        .then(saved => {
          product.questions.push(saved);
          renderQuestions(product);
          questionForm.reset();
        })
        .catch(err => {
          console.error('Error al enviar la pregunta:', err);
          alert('Ocurrió un error al guardar tu pregunta.');
        });
    });
  }
}

/**
 * Renderiza preguntas y, si están sin respuesta, muestra el botón para responder
 */
function renderQuestions(product) {
  const questionBox = document.getElementById('question-list');
  if (!questionBox || !Array.isArray(product.questions)) return;

  const sorted = [...product.questions].sort((a, b) => new Date(b.date) - new Date(a.date));
  questionBox.innerHTML = '';

  sorted.forEach((q, index) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'question-box mb-3';
    qDiv.innerHTML = `
      <strong>${q.user}</strong> (${q.date ? new Date(q.date).toLocaleDateString('es-AR') : 'Sin fecha'}): ${q.question}
      <div class="answer mt-1">
        <strong>Vendedor:</strong> ${
          q.answer
            ? `${q.answer}${q.answerDate ? ` <span class="text-muted">(${new Date(q.answerDate).toLocaleDateString('es-AR')})</span>` : ''}`
            : `<button class="btn btn-sm btn-outline-primary" data-index="${index}" data-product="${product.id}" onclick="openAnswerModal(this)">Responder</button>`
        }
      </div>
    `;
    questionBox.appendChild(qDiv);
  });
}

/**
 * Agrega efecto lupa a una imagen
 */
function addZoom(img, result, lens) {
  const cx = result.offsetWidth / lens.offsetWidth;
  const cy = result.offsetHeight / lens.offsetHeight;

  lens.style.width = "100px";
  lens.style.height = "100px";

  result.style.backgroundImage = `url('${img.src}')`;
  result.style.backgroundSize = `${img.naturalWidth * cx}px ${img.naturalHeight * cy}px`;

  function getCursorPos(e) {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  }

  function moveLens(e) {
    e.preventDefault();
    const pos = getCursorPos(e);
    let x = pos.x - lens.offsetWidth / 2;
    let y = pos.y - lens.offsetHeight / 2;

    const bounds = img.getBoundingClientRect();
    x = Math.max(0, Math.min(x, bounds.width - lens.offsetWidth));
    y = Math.max(0, Math.min(y, bounds.height - lens.offsetHeight));

    lens.style.left = x + "px";
    lens.style.top = y + "px";

    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;

    result.style.backgroundPosition = `-${x * scaleX}px -${y * scaleY}px`;
  }

  function showZoom() {
    lens.style.display = "block";
    result.style.display = "block";
  }

  function hideZoom() {
    lens.style.display = "none";
    result.style.display = "none";
  }

  img.addEventListener("mousemove", moveLens);
  lens.addEventListener("mousemove", moveLens);
  img.addEventListener("mouseover", showZoom);
  img.addEventListener("mouseout", hideZoom);
  lens.addEventListener("mouseout", hideZoom);
}

/**
 * Envía una nueva opinión del usuario
 */
const reviewForm = document.getElementById('review-form');
if (reviewForm) {
  reviewForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const user = document.getElementById('review-user').value.trim();
    const comment = document.getElementById('review-comment').value.trim();
    const rating = parseInt(document.getElementById('review-rating').value);

    if (!user || !comment || isNaN(rating)) {
      alert('Por favor completá todos los campos.');
      return;
    }

    const newReview = { user, comment, rating };

    fetch('http://localhost:3001/api/items/MLA001/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview)
    })
    .then(res => res.json())
    .then(saved => {
      const li = document.createElement('li');
      li.className = 'list-group-item review-box';
      li.innerHTML = `
        <div><strong>${saved.user}:</strong> ${saved.comment}</div>
        <div class="star" style="color:#007BFF;">${'★'.repeat(saved.rating)}</div>
      `;
      document.getElementById('review-list').prepend(li);
      reviewForm.reset();
    })
    .catch(err => {
      console.error('Error al enviar la opinión:', err);
      alert('Ocurrió un error al guardar tu opinión.');
    });
  });

  /**
   * Abre el modal para que el vendedor responda una pregunta
   */
  function openAnswerModal(button) {
    const productId = button.getAttribute('data-product');
    const index = button.getAttribute('data-index');

    document.getElementById("answer-product-id").value = productId;
    document.getElementById("answer-question-index").value = index;

    const modal = new bootstrap.Modal(document.getElementById("answerModal"));
    modal.show();
  }

  // Formulario del modal para responder preguntas
  const answerForm = document.getElementById('answer-form');
  if (answerForm) {
    answerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const productId = document.getElementById("answer-product-id").value;
      const questionIndex = document.getElementById("answer-question-index").value;
      const answerText = document.getElementById("answer-text").value.trim();

      if (!answerText) {
        alert("Por favor escribí una respuesta.");
        return;
      }

      fetch(`http://localhost:3001/api/items/${productId}/questions/${questionIndex}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answerText })
      })
      .then(res => res.json())
      .then(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById("answerModal"));
        modal.hide();
        window.location.reload(); // Refresca para mostrar respuesta actualizada
      })
      .catch(err => {
        console.error("Error al enviar respuesta:", err);
        alert("Ocurrió un error al guardar la respuesta.");
      });
    });
  }
}
