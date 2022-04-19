document.addEventListener("DOMContentLoaded", function () {
  const toc_url = "json/toc.json";

  fetch(toc_url)
    .then((response) => response.json())
    .then((json_object) => {
      const toc_list = document.querySelector("#toc");

      for (item of json_object.links) {
        const li_element = document.createElement("li");

        const anchor_element = document.createElement("a");

        anchor_element.href = item.url;

        anchor_element.innerText = item.label;

        li_element.appendChild(anchor_element);

        toc_list.appendChild(li_element);
      }
    });
});