const links = document.querySelectorAll("main .link-item a");
console.log(links);

links.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        // Ensure the target is an anchor tag with a valid href attribute
        const address = e.target.closest("a")?.href;

        if (address) {
            setTimeout(() => {
                window.open(address, "_blank");
            }, 300);
        }
    });
});
