$(function () {
    const products = [
        {
            name: "Camiseta Oversized",
            price: "R$ 99,90",
            page: "produto.html"
        },
        {
            name: "Urban Black",
            price: "R$ 109,90",
            page: "produto.html"
        },
        {
            name: "Urban White",
            price: "R$ 89,90",
            page: "produto.html"
        },
        {
            name: "World Cup Edition",
            price: "R$ 119,90",
            page: "produto.html"
        },
        {
            name: "Glass Signature",
            price: "R$ 109,90",
            page: "produto.html"
        },
        {
            name: "Regata Dry Fit",
            price: "R$ 89,90",
            page: "produto.html"
        }
    ];

    const $slides = $(".carousel-slide");
    let activeSlide = 0;

    function showSlide(index) {
        $slides.eq(activeSlide).removeClass("is-active");
        activeSlide = (index + $slides.length) % $slides.length;
        $slides.eq(activeSlide).addClass("is-active");
    }

    $(".carousel-arrow-left").on("click", function () {
        showSlide(activeSlide - 1);
    });

    $(".carousel-arrow-right").on("click", function () {
        showSlide(activeSlide + 1);
    });

    function openPanel(panelSelector) {
        $(".side-panel").removeClass("is-open").attr("aria-hidden", "true");
        $(panelSelector).addClass("is-open").attr("aria-hidden", "false");
        $(".site-overlay").addClass("is-visible");
        $("body").addClass("panel-open");
    }

    function closePanels() {
        $(".side-panel").removeClass("is-open").attr("aria-hidden", "true");
        $(".site-overlay").removeClass("is-visible");
        $("body").removeClass("panel-open");
    }

    $(".js-menu-open").on("click", function () {
        openPanel("#side-menu");
    });

    $(".js-cart-open").on("click", function () {
        openPanel("#side-cart");
    });

    $(".js-search-open").on("click", function () {
        openPanel("#side-search");
        $("#search-input").trigger("focus");
    });

    $(".js-panel-close, .site-overlay, .side-panel-nav a").on("click", closePanels);

    $(document).on("keydown", function (event) {
        if (event.key === "Escape") {
            closePanels();
        }
    });

    $("#message").on("input", function () {
        $("#message-counter").text(`${$(this).val().length} caracteres`);
    });

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setFieldError(fieldSelector, message) {
        $(fieldSelector).toggleClass("is-invalid", Boolean(message));
        $(`${fieldSelector}-error`).text(message);
    }

    function validateContactForm() {
        const name = $("#name").val().trim();
        const email = $("#email").val().trim();
        const message = $("#message").val().trim();

        setFieldError("#name", name ? "" : "Informe seu nome.");
        setFieldError("#email", emailPattern.test(email) ? "" : "Informe um e-mail válido.");
        setFieldError("#message", message.length >= 20 ? "" : "A mensagem deve ter pelo menos 20 caracteres.");

        return name && emailPattern.test(email) && message.length >= 20;
    }

    $("#name, #email, #message").on("input", function () {
        $(this).removeClass("is-invalid");
        $(`#${this.id}-error`).text("");
        $("#form-success").text("");
    });

    $("#contact-form").on("submit", function (event) {
        event.preventDefault();

        if (!validateContactForm()) {
            $(this).find(".is-invalid").first().trigger("focus");
            return;
        }

        this.reset();
        $("#message-counter").text("0 caracteres");
        $("#form-success").text("Mensagem validada e enviada com sucesso.");
    });

    $(".product-buy-button").on("click", function () {
        const size = $("input[name='size']:checked").val();
        $(".empty-cart-message, .cart-added-message")
            .removeClass("empty-cart-message")
            .addClass("cart-added-message")
            .html(`<strong>Camiseta Oversized — tamanho ${size}</strong><span>R$ 99,90</span>`);
        openPanel("#side-cart");
    });

    function renderSearchResults(query) {
        const normalizedQuery = query.trim().toLowerCase();
        const $results = $("#search-results");

        if (!normalizedQuery) {
            $results.html("<p>Digite para buscar produtos cadastrados.</p>");
            return;
        }

        const matches = products.filter(function (product) {
            return product.name.toLowerCase().includes(normalizedQuery);
        });

        if (!matches.length) {
            $results.html("<p>Nenhum produto encontrado.</p>");
            return;
        }

        const resultLinks = matches.map(function (product) {
            return `
                <a class="search-result-link" href="${product.page}">
                    <strong>${product.name}</strong>
                    <span>${product.price}</span>
                </a>
            `;
        }).join("");

        $results.html(resultLinks);
    }

    $("#search-input").on("input", function () {
        renderSearchResults($(this).val());
    });

    $("#search-form").on("submit", function (event) {
        event.preventDefault();
        renderSearchResults($("#search-input").val());
    });
});
